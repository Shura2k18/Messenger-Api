import {Schema, model} from'mongoose';

const UserContactsSchema = new Schema({
        userId: {type: Schema.Types.ObjectId, ref: 'Chatroom'},
        contacts: [
            {type: Schema.Types.ObjectId, ref: 'User'}
        ],
    },
    {
        timestamps: true
    }
)

export default model('UserContacts', UserContactsSchema);
