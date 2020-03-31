const Chat = require('./../models/chat');

function ChatService(chats) {
    if (!chats) {
        chats = {};
    }

    this.chats = chats;
    this.chatsSubscription = {};

    this.createChat = function(chatName) {
        let chat = new Chat(chatName);
        this.chats[chat.id] = chat;
        return chat.id;
    };
    
    this.addMessageToChat = function(chatId, chatMessage) {
        let chat = this.chats[chatId];
        if (!chat) {
            return false;
        }

        chat.addChatMessage(chatMessage);
        return true;
    };

    this.getChatHistory = function(chatId) {
        let chat = this.chats[chatId];
        if (!chat) {
            return false;
        }

        return chat.chatMessages;
    };

    this.subscribeToChat = function(user, chatId) {
        let subscribedUsers = this.getSubscribedUsers(chatId);
        subscribedUsers.add(user);
        this.chatsSubscription[chatId] = subscribedUsers;
    };

    this.getSubscribedUsers = function(chatId) {
        let subscribedUsers = this.chatsSubscription[chatID];
        if (!subscribedUsers) {
            subscribedUsers = new Set();
        }

        return subscribedUsers;
    };
}

module.exports = ChatService;