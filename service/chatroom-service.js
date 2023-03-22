import ChatroomModel from '../models/chatroom-model.js';
import UserModel from '../models/user-model.js';
import RoompersistModel from '../models/room-participants-model.js';
import MessageModel from '../models/message-model.js';
import ApiError from '../exceptions/api-error.js';
import fs from "fs";

class ChatroomService {
    async isChatAndUserAvailable(chatroomId, userId) {
        const chat = await RoompersistModel.findOne({chatroomId: chatroomId});
        if (!chat) throw ApiError.BadRequest(`Chatroom was not found`);

        let isAvailable = false;
        chat.users.forEach(user => {
            if (userId === String(user)) isAvailable = true
        })

        if(!isAvailable) throw ApiError.BadRequest(`User was not found`);
        return {chat}
    }
    async createRoom(name, createdBy, imageUrl, users, tag) {
        users.unshift(createdBy)

        const candidates = await UserModel.find();

        let isError = false;
        users.forEach(user => {
            let isAvailable = false;
            candidates.forEach(candidate => {
                if (user === String(candidate._id)) isAvailable = true;
            })
            if (!isAvailable) isError = true;
        })

        if(isError) throw ApiError.BadRequest(`User was not found`);

        const logo = process.env.API_URL + '/uploads/chats/chat.png'

        const chat = await ChatroomModel.create({name, createdBy, imageUrl: logo, tag})
        await RoompersistModel.create({chatroomId: chat._id, users})
        return {chat}
    }

    async joinRoom(chatroomId, userId) {
        const chat = await RoompersistModel.findOne({chatroomId});
        if (!chat) throw ApiError.BadRequest(`Chatroom was not found`);

        let isError = false;
        chat.users.forEach(user => {
            if (userId === String(user))  isError = true;
        })

        if(isError) throw ApiError.BadRequest(`User is already joined to the chat`);

        chat.users.push(userId);
        await chat.save();
        return {chat}
    }

    async leaveRoom(chatroomId, userId) {

        const {chat} = await this.isChatAndUserAvailable(chatroomId, userId);
        let userIndex = chat.users.indexOf(userId);

        if (userIndex !== -1) {
            chat.users.splice(userIndex, 1);
        }
        await chat.save();
        return {chat}
    }
    async deleteRoom(chatroom, userId) {
        await this.isChatAndUserAvailable(chatroom, userId);

        const chat = await ChatroomModel.findById(chatroom);

        if (chat.imageUrl !== null && chat.imageUrl !== `${process.env.API_URL}/uploads/chats/chat.png`) {
            let file = chat.imageUrl.split(process.env.API_URL + '/')[1];
            console.log(file)
            fs.unlink(file, function(err){
                if (err) {
                    console.log(err);
                }
            });
        }

        await ChatroomModel.deleteOne({_id: chatroom})
        await RoompersistModel.deleteOne({chatroomId: chatroom})
        await MessageModel.deleteMany({chatroomId: chatroom})
        return {chatroom}
    }

    async updateName(chatroomId, newName, user) {
        await this.isChatAndUserAvailable(chatroomId, user);
        const chat = await ChatroomModel.findOneAndUpdate({_id: chatroomId}, {name: newName}, {new: true});

        return {chat}
    }
    async updateImage(user, imageUrl, chatroomId) {
        await this.isChatAndUserAvailable(chatroomId, user);
        const chat = await ChatroomModel.findById(chatroomId);

        const newChat = await ChatroomModel.findOneAndUpdate({_id: chatroomId}, {imageUrl}, {new: true});
        if (chat.imageUrl !== null && chat.imageUrl !== `${process.env.API_URL}/uploads/chats/chat.png`) {
            let file = chat.imageUrl.split(process.env.API_URL + '/')[1]
            fs.unlink(file, function(err){
                if (err) {
                    console.log(err);
                }
            });
        }

        return {newChat}
    }
    async getChatrooms(user) {
        const chats = await RoompersistModel.find({'users': user}).populate('chatroomId');
        let chatrooms = [];
        chats.map(chat => {
            chatrooms.push(chat.chatroomId);
        })
        return {chatrooms}
    }
    async getChatroom(user, chatroomId) {
        await this.isChatAndUserAvailable(chatroomId, user);
        const chat = await ChatroomModel.findById(chatroomId);

        return {chat}
    }
    async findChatroom(text) {
        const a = text.slice(1, 2) ? 1: 0
        const b = text.slice(0, 1) ? 1: 0
        let chats;
        if (text.slice(0, 1) === '$' && a !== 0) {
            const re = RegExp(`\\$` + text.slice(1),"ig")
            chats = await ChatroomModel.find({'tag': re});
        } else if (text.slice(0, 1) !== '$' && b !== 0) {
            const re = RegExp(text,"ig")
            chats = await ChatroomModel.find({'name': re});
        } else {
            throw ApiError.BadRequest(`Chat was not found`);
        }

        return {chats}
    }
}

export default new ChatroomService();
