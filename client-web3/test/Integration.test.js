const { expect } = require('chai');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const Marketplace = artifacts.require('Marketplace');
const NFT = artifacts.require('NFT');

contract('Integration Tests', (accounts) => {
    let marketplace;
    let nft;
    const [deployer, seller, buyer1, buyer2, nonMember] = accounts;
    const feePercent = 2; // 2% fee
    const channelName = "Paranom Marketplace";
    const toWei = (num) => web3.utils.toWei(num.toString(), 'ether');

    beforeEach(async () => {
        // Deploy contracts
        nft = await NFT.new();
        marketplace = await Marketplace.new(channelName, feePercent);
        
        // Mint NFTs to seller
        await nft.mint("https://ipfs.io/ipfs/QmNFT1", { from: seller });
        await nft.mint("https://ipfs.io/ipfs/QmNFT2", { from: seller });
        await nft.mint("https://ipfs.io/ipfs/QmNFT3", { from: seller });
        
        // Give marketplace approval to transfer NFTs
        await nft.setApprovalForAll(marketplace.address, true, { from: seller });
    });

    describe('Complete NFT Marketplace Flow', () => {
        it('should handle complete marketplace workflow', async () => {
            const price1 = 1;
            const price2 = 2;
            
            // Step 1: Seller lists NFTs for sale
            await marketplace.makeItem(nft.address, 1, toWei(price1), { from: seller });
            await marketplace.makeItem(nft.address, 2, toWei(price2), { from: seller });
            
            // Verify items are listed
            expect(await marketplace.itemCount()).to.be.bignumber.equal(new BN(2));
            
            // Step 2: Buyer1 purchases first NFT
            const totalPrice1 = await marketplace.getTotalPrice(1);
            await marketplace.purchaseItem(1, { from: buyer1, value: totalPrice1 });
            
            // Verify ownership transfer
            expect(await nft.ownerOf(1)).to.equal(buyer1);
            expect((await marketplace.items(1)).sold).to.equal(true);
            expect((await marketplace.items(1)).owner).to.equal(buyer1);
            
            // Step 3: Buyer2 purchases second NFT
            const totalPrice2 = await marketplace.getTotalPrice(2);
            await marketplace.purchaseItem(2, { from: buyer2, value: totalPrice2 });
            
            // Verify ownership transfer
            expect(await nft.ownerOf(2)).to.equal(buyer2);
            expect((await marketplace.items(2)).sold).to.equal(true);
            expect((await marketplace.items(2)).owner).to.equal(buyer2);
            
            // Step 4: Verify both buyers can access channel
            expect(await marketplace.canJoinChannel({ from: buyer1 })).to.equal(true);
            expect(await marketplace.canJoinChannel({ from: buyer2 })).to.equal(true);
            expect(await marketplace.canJoinChannel({ from: nonMember })).to.equal(false);
            
            // Step 5: Verify users can get their items
            const buyer1Items = await marketplace.getMyItems({ from: buyer1 });
            const buyer2Items = await marketplace.getMyItems({ from: buyer2 });
            
            expect(buyer1Items.length).to.equal(1);
            expect(buyer2Items.length).to.equal(1);
            expect(buyer1Items[0].tokenId).to.be.bignumber.equal(new BN(1));
            expect(buyer2Items[0].tokenId).to.be.bignumber.equal(new BN(2));
        });

        it('should handle profile management after purchases', async () => {
            const price = 1;
            
            // List multiple NFTs
            await marketplace.makeItem(nft.address, 1, toWei(price), { from: seller });
            await marketplace.makeItem(nft.address, 2, toWei(price), { from: seller });
            await marketplace.makeItem(nft.address, 3, toWei(price), { from: seller });
            
            // Buyer1 purchases multiple items
            let totalPrice = await marketplace.getTotalPrice(1);
            await marketplace.purchaseItem(1, { from: buyer1, value: totalPrice });
            
            totalPrice = await marketplace.getTotalPrice(2);
            await marketplace.purchaseItem(2, { from: buyer1, value: totalPrice });
            
            // First item should be automatically set as profile
            let profileItem = await marketplace.getOwnerItemProfile(buyer1);
            expect(profileItem.tokenId).to.be.bignumber.equal(new BN(1));
            
            // User can change profile
            await marketplace.setOwnerItemProfile(2, { from: buyer1 });
            profileItem = await marketplace.getOwnerItemProfile(buyer1);
            expect(profileItem.tokenId).to.be.bignumber.equal(new BN(2));
            
            // Buyer2 purchases one item
            totalPrice = await marketplace.getTotalPrice(3);
            await marketplace.purchaseItem(3, { from: buyer2, value: totalPrice });
            
            // Their profile should be automatically set
            profileItem = await marketplace.getOwnerItemProfile(buyer2);
            expect(profileItem.tokenId).to.be.bignumber.equal(new BN(3));
        });
    });

    describe('Channel Integration', () => {
        beforeEach(async () => {
            // Setup: Create and purchase items so users can join channel
            await marketplace.makeItem(nft.address, 1, toWei(1), { from: seller });
            await marketplace.makeItem(nft.address, 2, toWei(1), { from: seller });
            
            const totalPrice1 = await marketplace.getTotalPrice(1);
            const totalPrice2 = await marketplace.getTotalPrice(2);
            
            await marketplace.purchaseItem(1, { from: buyer1, value: totalPrice1 });
            await marketplace.purchaseItem(2, { from: buyer2, value: totalPrice2 });
        });

        it('should allow marketplace participants to use channel features', async () => {
            // Verify members can send messages
            await marketplace.sendMessage(
                "Hello from buyer1!", 
                "https://example.com/buyer1.jpg", 
                "Buyer1", 
                { from: buyer1 }
            );
            
            await marketplace.sendMessage(
                "Hello from buyer2!", 
                "https://example.com/buyer2.jpg", 
                "Buyer2", 
                { from: buyer2 }
            );
            
            // Deployer (marketplace owner) should also be able to send messages
            await marketplace.sendMessage(
                "Welcome to the marketplace!", 
                "https://example.com/admin.jpg", 
                "Admin", 
                { from: deployer }
            );
            
            // Verify messages are stored
            const messages = await marketplace.getMessages({ from: buyer1 });
            expect(messages.length).to.equal(3);
            
            // Verify message content
            expect(messages[0].content).to.equal("Hello from buyer1!");
            expect(messages[1].content).to.equal("Hello from buyer2!");
            expect(messages[2].content).to.equal("Welcome to the marketplace!");
            
            // Verify senders
            expect(messages[0].sender).to.equal(buyer1);
            expect(messages[1].sender).to.equal(buyer2);
            expect(messages[2].sender).to.equal(deployer);
        });

        it('should prevent non-members from accessing channel', async () => {
            await expectRevert(
                marketplace.sendMessage("I shouldn't be able to send this", "pic", "name", { from: nonMember }),
                "You are not a member of this channel"
            );
            
            await expectRevert(
                marketplace.getMessages({ from: nonMember }),
                "You are not a member of this channel"
            );
            
            await expectRevert(
                marketplace.getMyMessages({ from: nonMember }),
                "You are not a member of this channel"
            );
        });

        it('should handle user-specific messages correctly', async () => {
            // Each user sends messages
            await marketplace.sendMessage("Message 1 from buyer1", "pic1", "Buyer1", { from: buyer1 });
            await marketplace.sendMessage("Message 2 from buyer1", "pic1", "Buyer1", { from: buyer1 });
            await marketplace.sendMessage("Message 1 from buyer2", "pic2", "Buyer2", { from: buyer2 });
            
            // Get user-specific messages
            const buyer1Messages = await marketplace.getMyMessages({ from: buyer1 });
            const buyer2Messages = await marketplace.getMyMessages({ from: buyer2 });
            
            expect(buyer1Messages.length).to.equal(2);
            expect(buyer2Messages.length).to.equal(1);
            
            expect(buyer1Messages[0].content).to.equal("Message 1 from buyer1");
            expect(buyer1Messages[1].content).to.equal("Message 2 from buyer1");
            expect(buyer2Messages[0].content).to.equal("Message 1 from buyer2");
        });
    });

    describe('Economic Flow and Fee Distribution', () => {
        it('should correctly distribute fees and payments', async () => {
            const price = 5; // 5 ETH
            const expectedFee = price * feePercent / 100; // 2% fee
            
            // Record initial balances
            const initialSellerBalance = new BN(await web3.eth.getBalance(seller));
            const initialFeeAccountBalance = new BN(await web3.eth.getBalance(deployer));
            
            // List and purchase item
            await marketplace.makeItem(nft.address, 1, toWei(price), { from: seller });
            const totalPrice = await marketplace.getTotalPrice(1);
            
            await marketplace.purchaseItem(1, { from: buyer1, value: totalPrice });
            
            // Check final balances
            const finalSellerBalance = new BN(await web3.eth.getBalance(seller));
            const finalFeeAccountBalance = new BN(await web3.eth.getBalance(deployer));
            
            // Seller should receive the item price (5 ETH)
            const sellerGain = finalSellerBalance.sub(initialSellerBalance);
            expect(sellerGain).to.be.bignumber.equal(toWei(price));
            
            // Fee account should receive the fee (0.1 ETH)
            const feeGain = finalFeeAccountBalance.sub(initialFeeAccountBalance);
            expect(feeGain).to.be.bignumber.equal(toWei(expectedFee));
        });

        it('should handle multiple sales correctly', async () => {
            const prices = [1, 2, 3]; // Different prices for different NFTs
            let totalExpectedSellerGain = 0;
            let totalExpectedFees = 0;
            
            // Calculate expected totals
            prices.forEach(price => {
                totalExpectedSellerGain += price;
                totalExpectedFees += price * feePercent / 100;
            });
            
            // Record initial balances
            const initialSellerBalance = new BN(await web3.eth.getBalance(seller));
            const initialFeeAccountBalance = new BN(await web3.eth.getBalance(deployer));
            
            // List all items
            for (let i = 0; i < prices.length; i++) {
                await marketplace.makeItem(nft.address, i + 1, toWei(prices[i]), { from: seller });
            }
            
            // Purchase all items
            for (let i = 1; i <= prices.length; i++) {
                const totalPrice = await marketplace.getTotalPrice(i);
                const buyer = i === 1 ? buyer1 : buyer2; // Alternate buyers
                await marketplace.purchaseItem(i, { from: buyer, value: totalPrice });
            }
            
            // Check final balances
            const finalSellerBalance = new BN(await web3.eth.getBalance(seller));
            const finalFeeAccountBalance = new BN(await web3.eth.getBalance(deployer));
            
            // Verify total gains
            const sellerGain = finalSellerBalance.sub(initialSellerBalance);
            const feeGain = finalFeeAccountBalance.sub(initialFeeAccountBalance);
            
            expect(sellerGain).to.be.bignumber.equal(toWei(totalExpectedSellerGain));
            expect(feeGain).to.be.bignumber.equal(toWei(totalExpectedFees));
        });
    });

    describe('Error Cases and Edge Scenarios', () => {
        it('should handle attempts to purchase non-existent items', async () => {
            await expectRevert(
                marketplace.purchaseItem(999, { from: buyer1, value: toWei(1) }),
                "item doesn't exist"
            );
        });

        it('should handle insufficient payment attempts', async () => {
            await marketplace.makeItem(nft.address, 1, toWei(5), { from: seller });
            
            await expectRevert(
                marketplace.purchaseItem(1, { from: buyer1, value: toWei(4) }),
                "not enough ether to cover item price and market fee"
            );
        });

        it('should handle double purchase attempts', async () => {
            await marketplace.makeItem(nft.address, 1, toWei(1), { from: seller });
            const totalPrice = await marketplace.getTotalPrice(1);
            
            // First purchase succeeds
            await marketplace.purchaseItem(1, { from: buyer1, value: totalPrice });
            
            // Second purchase fails
            await expectRevert(
                marketplace.purchaseItem(1, { from: buyer2, value: totalPrice }),
                "item already sold"
            );
        });

        it('should handle profile operations on non-owned items', async () => {
            await marketplace.makeItem(nft.address, 1, toWei(1), { from: seller });
            const totalPrice = await marketplace.getTotalPrice(1);
            await marketplace.purchaseItem(1, { from: buyer1, value: totalPrice });
            
            // buyer2 tries to set profile with buyer1's item
            await expectRevert(
                marketplace.setOwnerItemProfile(1, { from: buyer2 }),
                "It s not your item"
            );
        });
    });
}); 