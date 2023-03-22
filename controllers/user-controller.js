import userService from '../service/user-service.js';

class UserController {
    async getMe(req, res, next) {
        try {
            const user = await userService.getMe(req.user);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }
    async getUser(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await userService.getUser(userId);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }
    async getUsers(req, res, next) {
        try {
            const user = req.user.id;
            const users = await userService.getUsers(user);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
    async updateImage(req, res, next) {
        try {
            const imageUrl = `${process.env.API_URL}/uploads/users/${req.file.originalname}`;
            const user = req.user.id;
            const data = await userService.updateImage(user, imageUrl);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async updateName(req, res, next) {
        try {
            const { newName } = req.body;
            const user = req.user.id;
            const data = await userService.updateName(user, newName);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async addContact(req, res, next) {
        try {
            const userId = req.user.id;
            const { contactId } = req.body
            const data = await userService.addContact(userId, contactId);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async deleteContact(req, res, next) {
        try {
            const userId = req.user.id;
            const { contactId } = req.body
            const data = await userService.deleteContact(userId, contactId);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async getContacts(req, res, next) {
        try {
            const userId = req.user.id;
            const data = await userService.getContacts(userId);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
    async findUsers(req, res, next) {
        try {
            const text = req.params.text;
            const data = await userService.findUsers(text);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
}


export default new UserController();
