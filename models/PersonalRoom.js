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
    }
})

module.exports = mongoose.model('PersonalRoom', room);