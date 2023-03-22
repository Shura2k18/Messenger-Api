import multer from "multer";
import fs from "fs";
import { v4 as uuid } from 'uuid';

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads/chats')) {
            fs.mkdirSync('uploads/chats');
        }
        cb(null, 'uploads/chats');
        },
    filename: (_, file, cb) => {
        const newName = uuid(); // v34fa-asfasf-142saf-sa-asf
        file.originalname = `${newName}.jpg`;
        cb(null, file.originalname);
        },
});

const upload = multer({ storage });
export default upload;
