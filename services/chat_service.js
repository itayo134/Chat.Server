function ChatService() {
    this.chatMessages = [];
    this.allUsers = [];
    this.addChatMessage = function(chatMessage) {
        this.chatMessages.push(chatMessage)
    }
    this.addUser = function(user) {
        this.allUsers.push(user);
    }
}

exports.ChatService = ChatService;