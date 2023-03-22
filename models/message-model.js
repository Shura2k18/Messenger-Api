import {Schema, model} from'mongoose';

const MessageSchema = new Schema({
        message: {type: String, required: true},
        chatroomId: {type: Schema.Types.ObjectId, ref: 'Chatroom'},
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        isChanged: {type: Boolean, default: false}
    },
    {
        timestamps: true
    }
)

export default model('Message', MessageSchema);
