const { expect } = require('chai');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const Marketplace = artifacts.require('Marketplace');
const NFT = artifacts.require('NFT');

contract('Marketplace', (accounts) => {
    let marketplace;
    let nft;
    const [deployer, seller, buyer, user2] = accounts;
    const feePercent = 1; // 1% fee
    const channelName = "Test Channel";
    const toWei = (num) => web3.utils.toWei(num.toString(), 'ether');
    const fromWei = (num) => web3.utils.fromWei(num.toString(), 'ether');

    beforeEach(async () => {
        // Deploy NFT contract
        nft = await NFT.new();
        
        // Deploy Marketplace contract
        marketplace = await Marketplace.new(channelName, feePercent);
        
        // Mint an NFT to seller
        await nft.mint("https://www.tokens-example-metadata.com", { from: seller });
        
        // Give marketplace approval to transfer NFT
        await nft.setApprovalForAll(marketplace.address, true, { from: seller });
    });

    describe('Deployment', () => {
        it('should deploy correctly with proper initial values', async () => {
            expect(await marketplace.feeAccount()).to.equal(deployer);
            expect(await marketplace.feePercent()).to.be.bignumber.equal(new BN(feePercent));
            expect(await marketplace.itemCount()).to.be.bignumber.equal(new BN(0));
            expect(await marketplace.channelName()).to.equal(channelName);
        });
    });

    describe('Making items', () => {
        let price = 1;
        let result;

        beforeEach(async () => {
            result = await marketplace.makeItem(nft.address, 1, toWei(price), { from: seller });
        });

        it('should transfer NFT to marketplace', async () => {
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
        });

        it('should increment item count', async () => {
            expect(await marketplace.itemCount()).to.be.bignumber.equal(new BN(1));
        });

        it('should emit Offered event', async () => {
            expectEvent(result, 'Offered', {
                itemId: new BN(1),
                nft: nft.address,
                tokenId: new BN(1),
                price: toWei(price).toString(),
                seller: seller
            });
        });

        it('should create item with correct values', async () => {
            const item = await marketplace.items(1);
            expect(item.itemId).to.be.bignumber.equal(new BN(1));
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.be.bignumber.equal(new BN(1));
            expect(item.price).to.be.bignumber.equal(toWei(price).toString());
            expect(item.seller).to.equal(seller);
            expect(item.owner).to.equal(seller);
            expect(item.sold).to.equal(false);
        });

        it('should fail if price is zero', async () => {
            await nft.mint("https://www.tokens-example-metadata2.com", { from: seller });
            await expectRevert(
                marketplace.makeItem(nft.address, 2, 0, { from: seller }),
                "Price must be greater than zero"
            );
        });
    });

    describe('Purchasing marketplace items', () => {
        let price = 2;
        let fee = (feePercent / 100) * price;
        let totalPriceInWei;

        beforeEach(async () => {
            // seller makes their nft a marketplace item
            await marketplace.makeItem(nft.address, 1, toWei(price), { from: seller });
            totalPriceInWei = await marketplace.getTotalPrice(1);
        });

        it('should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event', async () => {
            const sellerInitialEthBal = await web3.eth.getBalance(seller);
            const feeAccountInitialEthBal = await web3.eth.getBalance(deployer);
            
            // buyer purchases item
            const result = await marketplace.purchaseItem(1, { from: buyer, value: totalPriceInWei });

            const sellerFinalEthBal = await web3.eth.getBalance(seller);
            const feeAccountFinalEthBal = await web3.eth.getBalance(deployer);

            // Item should be marked as sold
            expect((await marketplace.items(1)).sold).to.equal(true);

            // Seller should receive payment for the price of the NFT sold
            expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitialEthBal));

            // feeAccount should receive fee
            expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal));

            // The buyer should now own the nft
            expect(await nft.ownerOf(1)).to.equal(buyer);

            // Item owner should be updated to buyer
            expect((await marketplace.items(1)).owner).to.equal(buyer);

            // Buyer should be member of channel
            expect(await marketplace.canJoinChannel({ from: buyer })).to.equal(true);

            // Emit Bought event
            expectEvent(result, 'Bought', {
                itemId: new BN(1),
                nft: nft.address,
                tokenId: new BN(1),
                price: toWei(price).toString(),
                seller: seller,
                buyer: buyer
            });
        });

        it('should fail for invalid item ids', async () => {
            await expectRevert(
                marketplace.purchaseItem(2, { from: buyer, value: totalPriceInWei }),
                "item doesn't exist"
            );

            await expectRevert(
                marketplace.purchaseItem(0, { from: buyer, value: totalPriceInWei }),
                "item doesn't exist"
            );
        });

        it('should fail when not enough ether is paid', async () => {
            await expectRevert(
                marketplace.purchaseItem(1, { from: buyer, value: toWei(price) }),
                "not enough ether to cover item price and market fee"
            );
        });

        it('should fail when item already sold', async () => {
            // buyer purchases item 1
            await marketplace.purchaseItem(1, { from: buyer, value: totalPriceInWei });
            
            // user2 tries to buy item 1 after its sold
            await expectRevert(
                marketplace.purchaseItem(1, { from: user2, value: totalPriceInWei }),
                "item already sold"
            );
        });
    });

    describe('Total price', () => {
        it('should return asking price plus fee', async () => {
            const price = 2;
            await marketplace.makeItem(nft.address, 1, toWei(price), { from: seller });
            const totalPrice = await marketplace.getTotalPrice(1);
            expect(totalPrice).to.be.bignumber.equal(toWei(price * (100 + feePercent) / 100).toString());
        });
    });

    describe('Getting user items', () => {
        let price = 1;

        beforeEach(async () => {
            // Seller makes item
            await marketplace.makeItem(nft.address, 1, toWei(price), { from: seller });
            
            // Buyer purchases item
            const totalPrice = await marketplace.getTotalPrice(1);
            await marketplace.purchaseItem(1, { from: buyer, value: totalPrice });
        });

        it('should return user items correctly', async () => {
            const buyerItems = await marketplace.getMyItems({ from: buyer });
            expect(buyerItems.length).to.equal(1);
            expect(buyerItems[0].itemId).to.be.bignumber.equal(new BN(1));
            expect(buyerItems[0].owner).to.equal(buyer);
        });

        it('should fail when user has no items', async () => {
            await expectRevert(
                marketplace.getMyItems({ from: user2 }),
                "You have no items"
            );
        });
    });

    describe('Profile management', () => {
        let price = 1;

        beforeEach(async () => {
            // Mint another NFT
            await nft.mint("https://www.tokens-example-metadata2.com", { from: seller });
            await nft.setApprovalForAll(marketplace.address, true, { from: seller });
            
            // Seller makes items
            await marketplace.makeItem(nft.address, 1, toWei(price), { from: seller });
            await marketplace.makeItem(nft.address, 2, toWei(price), { from: seller });
            
            // Buyer purchases items
            let totalPrice = await marketplace.getTotalPrice(1);
            await marketplace.purchaseItem(1, { from: buyer, value: totalPrice });
            
            totalPrice = await marketplace.getTotalPrice(2);
            await marketplace.purchaseItem(2, { from: buyer, value: totalPrice });
        });

        it('should set profile item correctly', async () => {
            const result = await marketplace.setOwnerItemProfile(2, { from: buyer });
            
            expectEvent(result, 'changeProfile', {
                tokenId: new BN(2),
                user: buyer
            });
        });

        it('should get profile item correctly', async () => {
            await marketplace.setOwnerItemProfile(2, { from: buyer });
            const profileItem = await marketplace.getOwnerItemProfile(buyer);
            
            expect(profileItem.tokenId).to.be.bignumber.equal(new BN(2));
            expect(profileItem.owner).to.equal(buyer);
        });

        it('should fail when setting profile for non-existent item', async () => {
            await expectRevert(
                marketplace.setOwnerItemProfile(99, { from: buyer }),
                "item doesn't exist"
            );
        });

        it('should fail when setting profile for item not owned', async () => {
            await expectRevert(
                marketplace.setOwnerItemProfile(1, { from: user2 }),
                "It s not your item"
            );
        });

        it('should fail when getting profile for user with no profile set', async () => {
            await expectRevert(
                marketplace.getOwnerItemProfile(user2),
                "No profile set for this user"
            );
        });

        it('should automatically set first item as profile', async () => {
            // Mint new NFT and sell to user2
            await nft.mint("https://www.tokens-example-metadata3.com", { from: seller });
            await marketplace.makeItem(nft.address, 3, toWei(price), { from: seller });
            
            const totalPrice = await marketplace.getTotalPrice(3);
            await marketplace.purchaseItem(3, { from: user2, value: totalPrice });
            
            // Check that first item is automatically set as profile
            const profileItem = await marketplace.getOwnerItemProfile(user2);
            expect(profileItem.tokenId).to.be.bignumber.equal(new BN(3));
        });
    });

    describe('Channel functionality inheritance', () => {
        it('should allow purchased item owners to join channel', async () => {
            const price = 1;
            await marketplace.makeItem(nft.address, 1, toWei(price), { from: seller });
            
            const totalPrice = await marketplace.getTotalPrice(1);
            await marketplace.purchaseItem(1, { from: buyer, value: totalPrice });
            
            // Buyer should now be able to join channel
            expect(await marketplace.canJoinChannel({ from: buyer })).to.equal(true);
        });

        it('should not allow non-members to join channel', async () => {
            expect(await marketplace.canJoinChannel({ from: user2 })).to.equal(false);
        });
    });
}); 