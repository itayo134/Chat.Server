const protocols = require('./../consts').WS_PROTOCOL;

function ChatController(chatService) {
    this.chatService = chatService;
    this.connectedUsers = {};
    this._eventHandlers = {};

    this.getChatHistory = function(req, res) {
        res.send(chatService.getChatHistory("global_chat"));
    };

    this.onConnectionOpened = function(ws) {
        console.log("Opened new connection");

        ws.on("message", (function(message) {
            message = JSON.parse(message);
            const event = message.event;
            const eventHandler = this._eventHandlers[event];
            eventHandler(message, ws);
        }).bind(this))
    };

    this._handleSubscribe = function(message, ws) {
        const chatId = message.data;
        const user = message.user;
        if (!this.connectedUsers[user.id]) {
            this.connectedUsers[user.id] = ws;
        }

        this.chatService.subscribeToChat(user, chatId);
    }

    this.onConnectionOpened = this.onConnectionOpened.bind(this);
    this._handleSubscribe = this._handleSubscribe.bind(this);
    
    this._eventHandlers[protocols.SUBSCRIBE] = this._handleSubscribe;
}

module.exports = ChatController;