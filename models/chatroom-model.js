import {Schema, model} from'mongoose';

const ChatroomSchema = new Schema({
        name: {type: String, required: true},
        tag: {type: String, unique: true, required: true},
        imageUrl: {type: String},
        createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    },
    {
        timestamps: true
    }
)
ChatroomSchema.index({name: 'text', tag: 'text'})

export default model('Chatroom', ChatroomSchema);
