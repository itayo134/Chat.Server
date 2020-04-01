const protocols = require('./../consts').WS_PROTOCOL;
const ChatMessage = require('./../models/chat_message');

function ChatController(chatService) {
    this.chatService = chatService;
    this.connectedUsers = {};
    this._eventHandlers = {};
    
    this.getChatHistory = function(req, res) {
        res.send(chatService.getChatHistory("global_chat"));
    };

    this.onConnectionOpened = function(ws) {
        console.log("Opened new connection");
        let user = null;

        ws.on("message", (function(message) {
            message = JSON.parse(message);
            const event = message.event;
            user = message.user;
            const eventHandler = this._eventHandlers[event];
            eventHandler(message, ws);
        }).bind(this))

        ws.on("close", (function() {         
            
        }).bind(this));
    };

    this._handleSubscribe = function(message, ws) {
        const chatId = message.data;
        const user = message.user;
        this.connectedUsers[user.id] = ws;

        this.chatService.subscribeToChat(user, chatId);
    };
    
    this._handleWriteMessage = function(message, ws) {
        const chatId = message.data.chatId;
        const chatMessage = new ChatMessage(message.user, message.data.text);

        const success = this.chatService.addMessageToChat(chatId, chatMessage);
        if (success) {
            const subscribedUsers = this.chatService.getSubscribedUsers(chatId);
            subscribedUsers.forEach((user) => {
                this._sendMessageToUser(user, chatMessage);
            })
        }

    };

    this._sendMessageToUser = function(user, message) {
        const ws = this.connectedUsers[user.id];
        if (ws) {
            ws.send(JSON.stringify(message));
        }
    };

    
    this.onConnectionOpened = this.onConnectionOpened.bind(this);
    this._handleSubscribe = this._handleSubscribe.bind(this);
    this._handleWriteMessage = this._handleWriteMessage.bind(this);
    this._sendMessageToUser = this._sendMessageToUser.bind(this);
    
    this._eventHandlers[protocols.SUBSCRIBE] = this._handleSubscribe;
    this._eventHandlers[protocols.WRITE_MESSAGE] = this._handleWriteMessage;
}

module.exports = ChatController;