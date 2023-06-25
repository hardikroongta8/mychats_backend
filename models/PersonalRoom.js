const mongoose = require('mongoose');
const PersonalMessage = require('./PersonalMessage');

const room = mongoose.Schema({
    roomId: {
        required: true,
        type: String
    },
    messageList: [
        PersonalMessage.schema
    ],
    lastActive: {
        type: String, 
        required: true
    },
    unreadMessages: {
        count: {
            required: true,
            type: Number
        },
        phoneNumber: {
            required: true,
            type: String
        }
    },
});

module.exports = mongoose.model('PersonalRoom', room);