//Express
import {Router} from 'express';
const router = new Router();

//Controllers
import chatroomController from '../controllers/chatroom-controller.js';

//Middlewares
import authMiddleware from '../middlewares/auth-middleware.js';
import upload from '../middlewares/chat-file-middleware.js'
import {body} from "express-validator";

router.get('/getRooms', authMiddleware, chatroomController.getChatrooms);
router.get('/getRoom/:chatroom', authMiddleware, chatroomController.getChatroom);
router.get('/findRooms/:text', authMiddleware, chatroomController.findChatroom);
router.post('/createRoom', body('name').isLength({min: 1}), body('tag').isLength({min: 5}), authMiddleware, chatroomController.createRoom);
router.post('/joinRoom', authMiddleware, chatroomController.joinRoom);
router.post('/leaveRoom', authMiddleware, chatroomController.leaveRoom);
router.delete('/deleteRoom', authMiddleware, chatroomController.deleteRoom);
router.patch('/updateName', body('name').isLength({min: 1}), authMiddleware, chatroomController.updateName);
router.patch('/updateImage', authMiddleware, upload.single('imageUrl'), chatroomController.updateImage);

export default router
