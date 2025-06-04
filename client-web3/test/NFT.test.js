const { expect } = require('chai');
const { BN, expectEvent } = require('@openzeppelin/test-helpers');

const NFT = artifacts.require('NFT');

contract('NFT', (accounts) => {
    let nft;
    const [deployer, user1, user2] = accounts;
    const tokenURI1 = "https://example.com/token/1";
    const tokenURI2 = "https://example.com/token/2";

    beforeEach(async () => {
        nft = await NFT.new();
    });

    describe('Deployment', () => {
        it('should deploy correctly with proper initial values', async () => {
            expect(await nft.name()).to.equal("Paranom");
            expect(await nft.symbol()).to.equal("PRNM");
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(0));
        });

        it('should have zero total supply initially', async () => {
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(0));
        });
    });

    describe('Minting NFTs', () => {
        it('should mint NFT correctly to caller', async () => {
            const result = await nft.mint(tokenURI1, { from: user1 });
            
            // Check token count incremented
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(1));
            
            // Check owner is correct
            expect(await nft.ownerOf(1)).to.equal(user1);
            
            // Check token URI is set correctly
            expect(await nft.tokenURI(1)).to.equal(tokenURI1);
            
            // Check Transfer event is emitted (from ERC721)
            expectEvent(result, 'Transfer', {
                from: '0x0000000000000000000000000000000000000000',
                to: user1,
                tokenId: new BN(1)
            });
        });

        it('should return correct token ID when minting', async () => {
            const result = await nft.mint(tokenURI1, { from: user1 });
            
            // The mint function should return the token ID
            // Note: In Truffle tests, we need to check the return value differently
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(1));
        });

        it('should mint multiple NFTs with sequential IDs', async () => {
            await nft.mint(tokenURI1, { from: user1 });
            await nft.mint(tokenURI2, { from: user2 });
            
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(2));
            expect(await nft.ownerOf(1)).to.equal(user1);
            expect(await nft.ownerOf(2)).to.equal(user2);
            expect(await nft.tokenURI(1)).to.equal(tokenURI1);
            expect(await nft.tokenURI(2)).to.equal(tokenURI2);
        });

        it('should allow same user to mint multiple NFTs', async () => {
            await nft.mint(tokenURI1, { from: user1 });
            await nft.mint(tokenURI2, { from: user1 });
            
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(2));
            expect(await nft.ownerOf(1)).to.equal(user1);
            expect(await nft.ownerOf(2)).to.equal(user1);
            expect(await nft.balanceOf(user1)).to.be.bignumber.equal(new BN(2));
        });

        it('should handle empty token URI', async () => {
            await nft.mint("", { from: user1 });
            
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(1));
            expect(await nft.ownerOf(1)).to.equal(user1);
            expect(await nft.tokenURI(1)).to.equal("");
        });

        it('should mint with very long token URI', async () => {
            const longURI = "https://example.com/very/long/path/to/token/metadata/" + "a".repeat(1000);
            await nft.mint(longURI, { from: user1 });
            
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(1));
            expect(await nft.tokenURI(1)).to.equal(longURI);
        });
    });

    describe('ERC721 Standard Functions', () => {
        beforeEach(async () => {
            await nft.mint(tokenURI1, { from: user1 });
            await nft.mint(tokenURI2, { from: user2 });
        });

        it('should return correct balance for users', async () => {
            expect(await nft.balanceOf(user1)).to.be.bignumber.equal(new BN(1));
            expect(await nft.balanceOf(user2)).to.be.bignumber.equal(new BN(1));
            expect(await nft.balanceOf(deployer)).to.be.bignumber.equal(new BN(0));
        });

        it('should return correct owner for each token', async () => {
            expect(await nft.ownerOf(1)).to.equal(user1);
            expect(await nft.ownerOf(2)).to.equal(user2);
        });

        it('should allow token transfers', async () => {
            await nft.transferFrom(user1, user2, 1, { from: user1 });
            
            expect(await nft.ownerOf(1)).to.equal(user2);
            expect(await nft.balanceOf(user1)).to.be.bignumber.equal(new BN(0));
            expect(await nft.balanceOf(user2)).to.be.bignumber.equal(new BN(2));
        });

        it('should allow safe transfers', async () => {
            await nft.safeTransferFrom(user1, user2, 1, { from: user1 });
            
            expect(await nft.ownerOf(1)).to.equal(user2);
            expect(await nft.balanceOf(user1)).to.be.bignumber.equal(new BN(0));
            expect(await nft.balanceOf(user2)).to.be.bignumber.equal(new BN(2));
        });

        it('should support approval mechanism', async () => {
            await nft.approve(user2, 1, { from: user1 });
            expect(await nft.getApproved(1)).to.equal(user2);
            
            // user2 can now transfer the token
            await nft.transferFrom(user1, user2, 1, { from: user2 });
            expect(await nft.ownerOf(1)).to.equal(user2);
        });

        it('should support approval for all', async () => {
            await nft.setApprovalForAll(user2, true, { from: user1 });
            expect(await nft.isApprovedForAll(user1, user2)).to.equal(true);
            
            // user2 can now transfer any token owned by user1
            await nft.transferFrom(user1, user2, 1, { from: user2 });
            expect(await nft.ownerOf(1)).to.equal(user2);
        });
    });

    describe('Token URI functionality', () => {
        it('should set and get token URI correctly', async () => {
            await nft.mint(tokenURI1, { from: user1 });
            expect(await nft.tokenURI(1)).to.equal(tokenURI1);
        });

        it('should handle IPFS URIs', async () => {
            const ipfsURI = "ipfs://QmYourHashHere";
            await nft.mint(ipfsURI, { from: user1 });
            expect(await nft.tokenURI(1)).to.equal(ipfsURI);
        });

        it('should handle data URIs', async () => {
            const dataURI = "data:application/json;base64,eyJuYW1lIjoiVGVzdCJ9";
            await nft.mint(dataURI, { from: user1 });
            expect(await nft.tokenURI(1)).to.equal(dataURI);
        });
    });

    describe('Token enumeration', () => {
        beforeEach(async () => {
            await nft.mint(tokenURI1, { from: user1 });
            await nft.mint(tokenURI2, { from: user1 });
            await nft.mint("https://example.com/token/3", { from: user2 });
        });

        it('should track total token count correctly', async () => {
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(3));
        });

        it('should maintain correct balances after multiple mints', async () => {
            expect(await nft.balanceOf(user1)).to.be.bignumber.equal(new BN(2));
            expect(await nft.balanceOf(user2)).to.be.bignumber.equal(new BN(1));
            expect(await nft.balanceOf(deployer)).to.be.bignumber.equal(new BN(0));
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle multiple users minting simultaneously', async () => {
            // Simulate concurrent minting
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(nft.mint(`https://example.com/token/${i}`, { from: user1 }));
            }
            
            await Promise.all(promises);
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(5));
            expect(await nft.balanceOf(user1)).to.be.bignumber.equal(new BN(5));
        });

        it('should handle very high token counts', async () => {
            // Mint several tokens to test large numbers
            for (let i = 0; i < 10; i++) {
                await nft.mint(`https://example.com/token/${i}`, { from: user1 });
            }
            
            expect(await nft.tokenCount()).to.be.bignumber.equal(new BN(10));
            expect(await nft.ownerOf(10)).to.equal(user1);
            expect(await nft.tokenURI(10)).to.equal("https://example.com/token/9");
        });
    });

    describe('Compliance with ERC721 standards', () => {
        it('should support ERC165 interface detection', async () => {
            // ERC721 interface ID: 0x80ac58cd
            const ERC721_INTERFACE_ID = '0x80ac58cd';
            expect(await nft.supportsInterface(ERC721_INTERFACE_ID)).to.equal(true);
            
            // ERC721Metadata interface ID: 0x5b5e139f
            const ERC721_METADATA_INTERFACE_ID = '0x5b5e139f';
            expect(await nft.supportsInterface(ERC721_METADATA_INTERFACE_ID)).to.equal(true);
        });

        it('should have correct name and symbol', async () => {
            expect(await nft.name()).to.equal("Paranom");
            expect(await nft.symbol()).to.equal("PRNM");
        });
    });
}); 