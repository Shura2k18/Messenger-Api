import {Schema, model} from'mongoose';

const RoompersistSchema = new Schema({
        chatroomId: {type: Schema.Types.ObjectId, ref: 'Chatroom'},
        users: [
            {type: Schema.Types.ObjectId, ref: 'User'}
        ],
    },
    {
        timestamps: true
    }
)

export default model('Roompersist', RoompersistSchema);
