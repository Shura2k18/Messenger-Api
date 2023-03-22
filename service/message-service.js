import ApiError from '../exceptions/api-error.js';
import RoompersistModel from "../models/room-participants-model.js";
import MessageModel from "../models/message-model.js";
import UserDto from "../dtos/user-dto.js";

class MessageService {
    async isChatAndUserAvailable(chatroomId, userId) {
        const chat = await RoompersistModel.findOne({chatroomId: chatroomId});
        if (!chat) throw ApiError.BadRequest(`Chatroom was not found`);

        let isAvailable = false;
        chat.users.forEach(user => {
            if (userId === String(user)) isAvailable = true
        })

        if(!isAvailable) throw ApiError.BadRequest(`User was not found`);
    }
    async sendMessage(user, chatroomId, message) {
        await this.isChatAndUserAvailable(chatroomId, user);

        await MessageModel.create({user, chatroomId, message})
        const mess = await MessageModel.findOne({user, chatroomId, message}).populate('user')
        const userDto = new UserDto(mess.user)
        mess.user = userDto
        return {mess}
    }
    async editMessage(user, chatroomId, message, id) {
        await this.isChatAndUserAvailable(chatroomId, user);

        const mess = await MessageModel.findOneAndUpdate({
            _id: id
        }, {message: message, isChanged: true}, {new: true}).populate('user')
        const userDto = new UserDto(mess.user)
        mess.user = userDto
        return {mess}
    }
    async deleteMessage(user, chatroomId, id) {
        await this.isChatAndUserAvailable(chatroomId, user);

        const mess = await MessageModel.findOne({_id: id});
        if (!(user === String(mess.user))) throw ApiError.BadRequest(`You did not send this message`);

        await MessageModel.deleteOne({_id: id})
        return {id}
    }
    async getMessages(user, chatroomId) {
        await this.isChatAndUserAvailable(chatroomId, user);

        const messages = await MessageModel.find({chatroomId}).populate('user');
        messages.forEach(mess => {
            const userDto = new UserDto(mess.user)
            return mess.user = userDto
        })
        return {messages}
    }
    async findMessages(chatroomId, message) {
        const isChat = chatroomId.slice(0, 1) ? 1: 0
        const isMess = message.slice(0, 1) ? 1: 0
        if (!isChat || !isMess) throw ApiError.BadRequest(`Incorrect chat or message`);
        const re = RegExp(message,"ig")
        const messages = await MessageModel.find({chatroomId, message: re}).populate('user');
        messages.forEach(mess => {
            const userDto = new UserDto(mess.user)
            return mess.user = userDto
        })
        return {messages}
    }
}

export default new MessageService();
