const express = require('express');
const { createServer } = require('http');
const ChatService = require('./services/chat_service').ChatService;
const ChatMessage = require('./models/chat_message').ChatMessage;

const chatService = new ChatService();
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    chatService.addChatMessage(new ChatMessage("itay", "message"));
    res.send(chatService.chatMessages);
})

app.listen(port, () => console.log("Listening"));
