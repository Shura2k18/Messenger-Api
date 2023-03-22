import {Schema, model} from'mongoose';

const UserSchema = new Schema({
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        name: {type: String, required: true},
        imageUrl: {type: String},
        isActivated: {type: Boolean, default: false},
        activationLink: {type: String},
        tag: {type: String, unique: true, required: true}
    },
    {
        timestamps: true
    }
)
UserSchema.index({name: 'text', tag: 'text'})

export default model('User', UserSchema);
