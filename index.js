const express = require('express');
const { createServer } = require('http');
const ChatService = require('./services/chat_service');
const ChatMessage = require('./models/chat_message');
const Chat = require('./models/chat');
const globalChatId = require('./consts').GLOBAL_CHAT_ID;
const ChatController = require('./controllers/chat_controller');

const app = express();
const port = 3000;

const globalChat = new Chat("Global Chat");
globalChat.id = globalChatId;
addDefaultMessages(globalChat);
let chats = {};
chats[globalChatId] = globalChat;
const chatService = new ChatService(chats);
const chatController = new ChatController(chatService);

app.get('/', (req, res) => {
    chatController.getChatHistory(req, res);
})

app.listen(port, () => console.log("Listening"));


function addDefaultMessages(chat) {
    chat.addChatMessage(new ChatMessage("Admin", "Welcome to global chat!"));
    chat.addChatMessage(new ChatMessage("Admin", "Enjoy!"));
}