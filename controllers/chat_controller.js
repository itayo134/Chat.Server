function ChatController(chatService) {
    this.chatService = chatService;
    this.getChatHistory = function(req, res) {
        res.send(chatService.getChatHistory("global_chat"));
    }
}

module.exports = ChatController;