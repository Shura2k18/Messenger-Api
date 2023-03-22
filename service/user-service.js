import UserModel from '../models/user-model.js';
import UserContactsModel from "../models/user-contacts-model.js";
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';
import fs from 'fs'

class UserService {
    async updateImage(userId, imageUrl) {
        const user = await UserModel.findById(userId);

        const newUser = await UserModel.findOneAndUpdate({_id: userId}, {imageUrl}, {new: true});
        if (user.imageUrl !== null && chat.imageUrl !== `${process.env.API_URL}/uploads/chats/user.png`) {
            let file = user.imageUrl.split(process.env.API_URL + '/')[1]
            fs.unlink(file, function(err){
                if (err) {
                    console.log(err);
                }
            });
        }

        const userDto = new UserDto(newUser);
        return {userDto}
    }
    async updateName(userId, newName) {

        const newUser = await UserModel.findOneAndUpdate({_id: userId}, {name: newName}, {new: true});

        const userDto = new UserDto(newUser);
        return {userDto}
    }

    async getMe({id}) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw ApiError.BadRequest('User was not found')
        }
        const userDto = new UserDto(user);
        return userDto;
    }
    async getUsers(userId) {
        const users = await UserModel.find({_id: {$ne: userId}});
        if (!users) {
            throw ApiError.BadRequest('Users was not found')
        }
        
        users.forEach(user => {
            const userDto = new UserDto(user);
            return user._doc = userDto
        })
        return users;
    }
    async getUser(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw ApiError.BadRequest('User was not found')
        }
        const userDto = new UserDto(user);
        return userDto;
    }
    async addContact(userId, contactId) {
        const user = await UserContactsModel.findOne({userId, 'contacts': contactId});
        if (user) {
            throw ApiError.BadRequest('The contact already exists')
        }

        const isContacts = await UserContactsModel.findOne({userId});
        if (isContacts) {
            isContacts.contacts.push(contactId)
            await isContacts.save()
        } else {
            let con = [];
            con.push(contactId);
            await UserContactsModel.create({userId, contacts: con})
        }
        const contacts = await UserContactsModel.findOne({userId}).populate('contacts');
        let contact;
        contacts.contacts.forEach(c => {
            c._id == contactId ? contact = Object.assign({}, c._doc) : contact
        })
        const userDto = new UserDto(contact);
        return userDto;
    }
    async deleteContact(userId, contactId) {
        const user = await UserContactsModel.findOne({userId, 'contacts': contactId});
        if (!user) {
            throw ApiError.BadRequest('No such contact exists')
        }

        const contacts = await UserContactsModel.findOne({userId});
        let contactIndex = contacts.contacts.indexOf(contactId);

        if (contactIndex !== -1) {
            contacts.contacts.splice(contactIndex, 1);
        }
        await contacts.save();

        if (contacts.contacts.length === 0) {
            await UserContactsModel.findOneAndDelete({userId})
        }
        return contactId;
    }
    async getContacts(userId) {
        const contacts = await UserContactsModel.findOne({userId}).populate('contacts');
        if (!contacts) {
            throw ApiError.BadRequest('You have no contacts')
        }

        contacts.contacts.forEach(c => {
            const userDto = new UserDto(c);
            return c._doc = userDto
        })
        console.log(contacts.contacts);

        return contacts.contacts;
    }
    async findUsers(text) {
        const a = text.slice(1, 2) ? 1: 0
        const b = text.slice(0, 1) ? 1: 0
        let users;
        if (text.slice(0, 1) === '@' && a !== 0) {
            const re = RegExp(`\\@` + text.slice(1),"ig")
            users = await UserModel.find({'tag': re});
            users.forEach(user => {
                console.log(user)
                const userDto = new UserDto(user)
                return user._doc = userDto
            })
        } else if (text.slice(0, 1) !== '@' && b !== 0) {
            const re = RegExp(text,"ig")
            users = await UserModel.find({'name': re});
            users.forEach(user => {
                const userDto = new UserDto(user)
                return user._doc = userDto
            })
        } else {
            throw ApiError.BadRequest(`User was not found`);
        }

        return {users}
    }
}

export default new UserService();
