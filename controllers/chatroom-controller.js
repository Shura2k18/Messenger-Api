import chatroomService from'../service/chatroom-service.js';
import {validationResult} from'express-validator';
import ApiError from'../exceptions/api-error.js';

class UserController {
    async createRoom(req, res, next) {
        try {
            const {name, imageUrl, users, tag} = req.body;
            const createdBy = req.user.id;
            const chatroomData = await chatroomService.createRoom(name, createdBy, imageUrl, users, tag);
            return res.json(chatroomData);
        } catch (e) {
            next(e);
        }
    }

    async joinRoom(req, res, next) {
        try {
            const {chatroomId} = req.body;
            const user = req.user.id;
            const data = await chatroomService.joinRoom(chatroomId, user);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async leaveRoom(req, res, next) {
        try {
            const {chatroomId} = req.body;
            const user = req.user.id;
            const data = await chatroomService.leaveRoom(chatroomId, user);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async deleteRoom(req, res, next) {
        try {
            const {chatroomId} = req.body;
            const user = req.user.id;
            const data = await chatroomService.deleteRoom(chatroomId, user);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async updateName(req, res, next) {
        try {
            const {newName, chatroomId} = req.body;
            const user = req.user.id;
            const data = await chatroomService.updateName(chatroomId, newName, user);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async updateImage(req, res, next) {
        try {
            const imageUrl = `${process.env.API_URL}/uploads/chats/${req.file.originalname}`;
            const {chatroomId} = req.body;
            const user = req.user.id;
            const data = await chatroomService.updateImage(user, imageUrl, chatroomId);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async getChatrooms(req, res, next) {
        try {
            const user = req.user.id;
            const data = await chatroomService.getChatrooms(user);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async getChatroom(req, res, next) {
        try {
            const user = req.user.id;
            const chatroom = req.params.chatroom;
            const data = await chatroomService.getChatroom(user, chatroom);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async findChatroom(req, res, next) {
        try {
            const text = req.params.text;
            const data = await chatroomService.findChatroom(text);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
}


export default new UserController();
