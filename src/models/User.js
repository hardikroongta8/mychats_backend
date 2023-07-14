const mongoose = require('mongoose');
const PersonalMessage = require('./PersonalMessage');

const user = new mongoose.Schema({
    firebaseId: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: false,
        default: 'Hey there! I am using MyChats.'
    },
    profilePicUrl: {
        type: String,
        required: false,
        default: null,
    },
    contactInfo: [
        {
            phoneNumber: {
                type: String,
                required: true
            },
            displayName: {
                type: String,
                required: true
            },
            roomId: {
                type:String,
                required: true
            }
        }
    ],
    activeRooms: [
        {
            roomId: {
                type: String,
                required: true
            },
            lastActive: {
                type: String,
                required: true
            },
            lastMessage: {
                type: PersonalMessage.schema,
                required: true
            },
            count: {
                required: true, 
                type: Number
            }
        }
    ],
    groups: [
        {
            type: String,
            required: true,
        }
    ]
});

module.exports = mongoose.model('User', user);