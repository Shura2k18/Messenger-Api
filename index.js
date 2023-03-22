import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import userRouter from './router/user-router.js';
import chatroomRouter from './router/chatroom-router.js';
import messageRouter from './router/message-router.js';
import authRouter from './router/auth-router.js';
import errorMiddleware from './middlewares/error-middleware.js';
import { Server } from 'socket.io'
import ApiError from './exceptions/api-error.js';
import RoompersistModel from "./models/room-participants-model.js";
import MessageModel from "./models/message-model.js";

//Create server
const PORT = process.env.PORT || 5000;
const app = express()

//Middlewares
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/chatroom', chatroomRouter);
app.use('/message', messageRouter);
app.use(errorMiddleware);

//Server start function
const start = async () => {
    try {
        //Сonnecting to mongo
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Mongo has connected successfully'))
        .catch((err) => console.log('Mongo connection has an error', err));

        //Start server
        const server = app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))

        const io = new Server(server, {
            allowEIO3: true,
            cors: {
                origin: true,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        io.use(async (socket, next) => {
            try {
                const token = socket.handshake.query.token;
                const payload = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
                socket.userId = payload.id;
                next();
            } catch (err) {}
        });
        io.on("connection", (socket) => {
            console.log("Connected: " + socket.userId);

            socket.on("disconnect", () => {
                console.log("Disconnected: " + socket.userId);
            });

            socket.on("joinRoom", ({ chatroomId }) => {
                socket.join(chatroomId);
                console.log("A user joined chatroom: " + chatroomId);
            });

            socket.on("leaveRoom", ({ chatroomId }) => {
                socket.leave(chatroomId);
                console.log("A user left chatroom: " + chatroomId);
            });

            socket.on("sendMessage", async ({ chatroomId, message }) => {
                if (message.trim().length > 0) {
                    const chat = await RoompersistModel.findOne({'users': socket.userId, 'chatroomId': chatroomId}).populate('users');
                    let user;
                    chat.users.forEach(c => {
                        c._id == socket.userId ? user = Object.assign({}, c._doc) : user
                    })
                    console.log(user.name + "   " + message)
                    const newMessage = new MessageModel({
                        chatroomId: chatroomId,
                        user: socket.userId,
                        message,
                    });
                    io.to(chatroomId).emit("getMessage", {
                        message,
                        name: user.name,
                        userId: socket.userId,
                    });
                    await newMessage.save();
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}

start()