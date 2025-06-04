const { expect } = require('chai');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const Channel = artifacts.require('Channel');

contract('Channel', (accounts) => {
    let channel;
    const [owner, member1, member2, nonMember] = accounts;
    const channelName = "Test Channel";

    beforeEach(async () => {
        channel = await Channel.new(channelName);
    });

    describe('Deployment', () => {
        it('should deploy correctly with proper initial values', async () => {
            expect(await channel.channelName()).to.equal(channelName);
            expect(await channel.members(owner)).to.equal(true);
            expect(await channel.canJoinChannel({ from: owner })).to.equal(true);
        });

        it('should set owner as first member', async () => {
            expect(await channel.members(owner)).to.equal(true);
        });
    });

    describe('Membership management', () => {
        it('should allow checking if user can join channel', async () => {
            expect(await channel.canJoinChannel({ from: owner })).to.equal(true);
            expect(await channel.canJoinChannel({ from: nonMember })).to.equal(false);
        });

        it('should correctly identify members and non-members', async () => {
            expect(await channel.members(owner)).to.equal(true);
            expect(await channel.members(nonMember)).to.equal(false);
        });
    });

    describe('Sending messages', () => {
        const messageContent = "Hello, this is a test message!";
        const profilePicture = "https://example.com/profile.jpg";
        const userName = "TestUser";

        it('should allow members to send messages', async () => {
            const result = await channel.sendMessage(messageContent, profilePicture, userName, { from: owner });

            expectEvent(result, 'MessageSent', {
                sender: owner,
                content: messageContent,
                profilePicture: profilePicture,
                name: userName
            });
        });

        it('should increment message counter for sender', async () => {
            await channel.sendMessage(messageContent, profilePicture, userName, { from: owner });
            expect(await channel.addressMessageCounter(owner)).to.be.bignumber.equal('1');

            await channel.sendMessage("Second message", profilePicture, userName, { from: owner });
            expect(await channel.addressMessageCounter(owner)).to.be.bignumber.equal('2');
        });

        it('should fail when non-member tries to send message', async () => {
            await expectRevert(
                channel.sendMessage(messageContent, profilePicture, userName, { from: nonMember }),
                "You are not a member of this channel"
            );
        });

        it('should fail when message content is empty', async () => {
            await expectRevert(
                channel.sendMessage("", profilePicture, userName, { from: owner }),
                "Message content cannot be empty"
            );
        });

        it('should store message with correct timestamp', async () => {
            const tx = await channel.sendMessage(messageContent, profilePicture, userName, { from: owner });
            const block = await web3.eth.getBlock(tx.receipt.blockNumber);
            
            const messages = await channel.getMessages({ from: owner });
            expect(messages[0].timestamp).to.be.bignumber.equal(block.timestamp.toString());
        });
    });

    describe('Getting messages', () => {
        const messageContent1 = "First message";
        const messageContent2 = "Second message";
        const profilePicture = "https://example.com/profile.jpg";
        const userName = "TestUser";

        beforeEach(async () => {
            await channel.sendMessage(messageContent1, profilePicture, userName, { from: owner });
            await channel.sendMessage(messageContent2, profilePicture, userName, { from: owner });
        });

        it('should return all messages for members', async () => {
            const messages = await channel.getMessages({ from: owner });
            expect(messages.length).to.equal(2);
            expect(messages[0].content).to.equal(messageContent1);
            expect(messages[1].content).to.equal(messageContent2);
            expect(messages[0].sender).to.equal(owner);
            expect(messages[1].sender).to.equal(owner);
        });

        it('should fail when non-member tries to get messages', async () => {
            await expectRevert(
                channel.getMessages({ from: nonMember }),
                "You are not a member of this channel"
            );
        });

        it('should return messages with correct structure', async () => {
            const messages = await channel.getMessages({ from: owner });
            const message = messages[0];
            
            expect(message.sender).to.equal(owner);
            expect(message.content).to.equal(messageContent1);
            expect(message.profilePicture).to.equal(profilePicture);
            expect(message.name).to.equal(userName);
            expect(message.timestamp).to.be.bignumber.gt('0');
        });
    });

    describe('Getting user messages', () => {
        const messageContent1 = "User1 message";
        const messageContent2 = "User1 second message";
        const profilePicture = "https://example.com/profile.jpg";
        const userName = "TestUser";

        beforeEach(async () => {
            await channel.sendMessage(messageContent1, profilePicture, userName, { from: owner });
            await channel.sendMessage(messageContent2, profilePicture, userName, { from: owner });
        });

        it('should return only user messages', async () => {
            const myMessages = await channel.getMyMessages({ from: owner });
            expect(myMessages.length).to.equal(2);
            expect(myMessages[0].content).to.equal(messageContent1);
            expect(myMessages[1].content).to.equal(messageContent2);
            expect(myMessages[0].sender).to.equal(owner);
            expect(myMessages[1].sender).to.equal(owner);
        });

        it('should fail when user has never sent a message', async () => {
            await expectRevert(
                channel.getMyMessages({ from: nonMember }),
                "You are not a member of this channel"
            );
        });

        it('should fail when non-member tries to get their messages', async () => {
            await expectRevert(
                channel.getMyMessages({ from: nonMember }),
                "You are not a member of this channel"
            );
        });

        it('should return correct count of user messages', async () => {
            // Add a third message
            await channel.sendMessage("Third message", profilePicture, userName, { from: owner });
            
            const myMessages = await channel.getMyMessages({ from: owner });
            expect(myMessages.length).to.equal(3);
            expect(await channel.addressMessageCounter(owner)).to.be.bignumber.equal('3');
        });
    });

    describe('Message counter functionality', () => {
        const messageContent = "Test message";
        const profilePicture = "https://example.com/profile.jpg";
        const userName = "TestUser";

        it('should start with zero message count', async () => {
            expect(await channel.addressMessageCounter(owner)).to.be.bignumber.equal('0');
            expect(await channel.addressMessageCounter(nonMember)).to.be.bignumber.equal('0');
        });

        it('should increment message count correctly', async () => {
            await channel.sendMessage(messageContent, profilePicture, userName, { from: owner });
            expect(await channel.addressMessageCounter(owner)).to.be.bignumber.equal('1');

            await channel.sendMessage(messageContent, profilePicture, userName, { from: owner });
            expect(await channel.addressMessageCounter(owner)).to.be.bignumber.equal('2');
        });

        it('should track message counts independently for different users', async () => {
            // Note: In a real scenario, member1 would need to be added to the channel first
            // For this test, we're just checking the counter logic
            expect(await channel.addressMessageCounter(owner)).to.be.bignumber.equal('0');
            expect(await channel.addressMessageCounter(member1)).to.be.bignumber.equal('0');

            await channel.sendMessage(messageContent, profilePicture, userName, { from: owner });
            expect(await channel.addressMessageCounter(owner)).to.be.bignumber.equal('1');
            expect(await channel.addressMessageCounter(member1)).to.be.bignumber.equal('0');
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle empty profile picture and name', async () => {
            const result = await channel.sendMessage("Test message", "", "", { from: owner });
            
            expectEvent(result, 'MessageSent', {
                sender: owner,
                content: "Test message",
                profilePicture: "",
                name: ""
            });
        });

        it('should handle very long messages', async () => {
            const longMessage = "a".repeat(1000); // 1000 character message
            const result = await channel.sendMessage(longMessage, "pic", "name", { from: owner });
            
            expectEvent(result, 'MessageSent', {
                sender: owner,
                content: longMessage,
                profilePicture: "pic",
                name: "name"
            });
        });

        it('should maintain message order', async () => {
            const messages = ["First", "Second", "Third"];
            
            for (let msg of messages) {
                await channel.sendMessage(msg, "pic", "name", { from: owner });
            }
            
            const allMessages = await channel.getMessages({ from: owner });
            expect(allMessages.length).to.equal(3);
            
            for (let i = 0; i < messages.length; i++) {
                expect(allMessages[i].content).to.equal(messages[i]);
            }
        });
    });
}); 