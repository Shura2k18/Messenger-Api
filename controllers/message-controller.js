import messageService from '../service/message-service.js';
import {validationResult} from 'express-validator';
import ApiError from '../exceptions/api-error.js';

class UserController {
    async sendMessage(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            const user = req.user.id;
            const {message, chatroomId} = req.body;
            const data = await messageService.sendMessage(user, chatroomId, message);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async editMessage(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            const user = req.user.id;
            const {message, messageId, chatroomId} = req.body;
            const data = await messageService.editMessage(user, chatroomId, message, messageId);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async deleteMessage(req, res, next) {
        try {
            const user = req.user.id;
            const {messageId, chatroomId} = req.body;
            const data = await messageService.deleteMessage(user, chatroomId, messageId);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async getMessages(req, res, next) {
        try {
            const chatroom = req.params.chatroom;
            const user = req.user.id;
            const data = await messageService.getMessages(user, chatroom);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async findMessages(req, res, next) {
        try {
            const chatroomId = req.query.chatroomId;
            const message = req.query.message;
            const data = await messageService.findMessages(chatroomId, message);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
}


export default new UserController();
