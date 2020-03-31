const Chat = require('./../models/chat');

function ChatService(chats) {
    if (!chats) {
        chats = {};
    }
    this.chats = chats;

    this.createChat = function(chatName) {
        let chat = new Chat(chatName);
        this.chats[chat.id] = chat;
        return chat.id;
    }
    this.addMessageToChat = function(chatId, chatMessage) {
        let chat = this.chats[chatId];
        if (!chat) {
            return false;
        }

        chat.addChatMessage(chatMessage);
        return true;
    }
    this.getChatHistory = function(chatId) {
        let chat = this.chats[chatId];
        if (!chat) {
            return false;
        }

        return chat.chatMessages;
    }
}

module.exports = ChatService;