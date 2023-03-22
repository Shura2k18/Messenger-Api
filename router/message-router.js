//Express
import {Router} from 'express';
const router = new Router();

//Controllers
import messageController from'../controllers/message-controller.js';

//Middlewares
import authMiddleware from'../middlewares/auth-middleware.js';

import {body} from'express-validator';

router.post('/sendMessage',
    body('message').isLength({min: 1}),
    authMiddleware,
    messageController.sendMessage
);
router.patch('/editMessage',
    authMiddleware,
    body('message').isLength({min: 1}),
    messageController.editMessage);
router.delete('/deleteMessage', authMiddleware, messageController.deleteMessage);
router.get('/getMessages/:chatroom', authMiddleware, messageController.getMessages);
router.get('/findMessages/', authMiddleware, messageController.findMessages);

export default router
