const uuid = require('uuid').v4;

function Chat(chatName) {
    this.chatName = chatName;
    this.id = uuid();
    this.chatMessages = [];
    this.allUsers = [];
    this.addChatMessage = function(chatMessage) {
        this.chatMessages.push(chatMessage)
    }

    this.addUser = function(user) {
        this.allUsers.push(user);
    } 
}

module.exports = Chat;