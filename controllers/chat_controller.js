const protocols = require('./../consts').WS_PROTOCOL;
const ChatMessage = require('./../models/chat_message');

function ChatController(chatService, authService) {
    this.chatService = chatService;
    this.authService = authService;
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
            eventHandler(message, ws, event);
        }).bind(this))

        ws.on("close", (function() {         
            
        }).bind(this));
    };

    this._handleSubscribe = function(message, ws, protocol) {
        const chatId = message.data;
        const user = message.user;
        this.connectedUsers[user.id] = ws;

        this.chatService.subscribeToChat(user, chatId);
    };
    
    this._handleWriteMessage = function(message, ws, protocol) {
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

    this.signUpUser = function(message, ws, protocol) {
        const username = message.data.username;
        const password = message.data.password;
        const isAdvisor = false;
        
        const success = this.authService.createUser(username, password, isAdvisor);
        ws.send({
            [protocol]: success
        });
    }

    this.signInUser = function (message, ws, protocol) {
        const username = message.data.username;
        const password = message.data.password;
        
        const success = this.authService.signIn(username, password);
        ws.send({
            [protocol]: success
        });
    };

    
    this.onConnectionOpened = this.onConnectionOpened.bind(this);
    this._handleSubscribe = this._handleSubscribe.bind(this);
    this._handleWriteMessage = this._handleWriteMessage.bind(this);
    this._sendMessageToUser = this._sendMessageToUser.bind(this);
    this.signUpUser = this.signUpUser.bind(this);
    this.signInUser = this.logInUser.bind(this);
    
    this._eventHandlers[protocols.SUBSCRIBE] = this._handleSubscribe;
    this._eventHandlers[protocols.WRITE_MESSAGE] = this._handleWriteMessage;
    this._eventHandlers[protocols.SIGN_UP] = this.signUpUser;
    this._eventHandlers[protocols.SIGN_IN] = this.logInUser;
}

module.exports = ChatController;