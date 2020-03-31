function ChatController(chatService) {
    this.chatService = chatService;
    this.connectedUsers = {};

    this.getChatHistory = function(req, res) {
        res.send(chatService.getChatHistory("global_chat"));
    };

    this.onConnectionOpened = function(ws) {
        console.log("Opened new connection");

        ws.on("message", function(message) {

        })
    };
}

module.exports = ChatController;