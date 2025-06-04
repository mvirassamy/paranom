// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Channel {
    struct Message {
        address sender;
        string content;
        string profilePicture;
        string name;
        uint timestamp;
    }


    event MessageSent(
        address indexed sender,
        string content,
        string profilePicture,
        string name,
        uint timestamp
    );

    address private owner;
    string public channelName;
    mapping(address => bool) public members;
    mapping(address => uint) public addressMessageCounter;
    Message[] private channelMessages;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyMembers() {
        require(members[msg.sender], "You are not a member of this channel");
        _;
    }

    constructor(string memory _channelName) {
        owner = msg.sender;
        channelName = _channelName;
        members[msg.sender] = true;
    }

    function _joinChannel() internal {
        members[msg.sender] = true;
    }

    function _leaveChannel() internal {
        members[msg.sender] = false;
    }

    function canJoinChannel()  public view returns (bool)  {
        return members[msg.sender];
    }

    function sendMessage(string memory _content, string memory _picture, string memory _name) public onlyMembers {
        require(bytes(_content).length > 0, "Message content cannot be empty");

        Message memory newMessage = Message({
            sender: msg.sender,
            content: _content,
            profilePicture: _picture,
            name: _name,
            timestamp: block.timestamp
        });

        channelMessages.push(newMessage);
        addressMessageCounter[msg.sender]++;
        emit MessageSent(msg.sender, _content, _picture, _name, block.timestamp);
    }

    function getMessages() public onlyMembers view returns (Message[] memory) {
        return channelMessages;
    }


    function getMyMessages() public onlyMembers view returns (Message[] memory)  {
        require(addressMessageCounter[msg.sender] > 0, "You have never send a message");
        Message[] memory myMessage = new Message[](addressMessageCounter[msg.sender]);
        uint counter = 0;

        for (uint i = 0; i < channelMessages.length; i++) {
            if (channelMessages[i].sender == msg.sender) {
                myMessage[counter] = channelMessages[i];
                counter++;
            }
        }

        return myMessage;
    }
}
