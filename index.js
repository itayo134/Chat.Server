const express = require('express');
let WebSocketServer = require('ws').Server;
let http = require('http');
const ChatService = require('./services/chat_service');
const ChatMessage = require('./models/chat_message');
const Chat = require('./models/chat');
const globalChatId = require('./consts').GLOBAL_CHAT_ID;
const ChatController = require('./controllers/chat_controller');
const User = require('./models/user');

const webSocketPort = 1331;
const restPort = 1332;

const adminUser = new User("Admin");
const globalChat = new Chat("Global Chat");
globalChat.id = globalChatId;
addDefaultMessages(globalChat, adminUser);
let chats = {};
chats[globalChatId] = globalChat;
const chatService = new ChatService(chats);
const chatController = new ChatController(chatService);
chatService.subscribeToChat(adminUser, globalChatId);

setRestServer(restPort, chatController);
setWsServer(webSocketPort, chatController);

function addDefaultMessages(chat, user) {
    chat.addChatMessage(new ChatMessage(user, "Welcome to global chat!"));
    chat.addChatMessage(new ChatMessage(user, "Enjoy!"));
}

function setWsServer(port, chatController) {
    const webSocket = new WebSocketServer({port: port});
    webSocket.on("connection", chatController.onConnectionOpened);
}

function setRestServer(port, chatController) {
    const restServer = express();
    restServer.get('/', (req, res) => {
        chatController.getChatHistory(req, res);
    })
    
    restServer.listen(port, () => console.log("Rest server activated"));
}