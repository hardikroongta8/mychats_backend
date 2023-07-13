const mongoose = require('mongoose');

const group = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: null,
    },
    profilePicUrl: {
        type: String, 
        required: false,
        default: null,
    },
    //List of firebaseIds of participants
    participantsList: [
        {
            firebaseId: {
                required: true,
                type: String
            },
            isAdmin: {
                required: true,
                type: Boolean
            }
        },
    ]
});

module.exports = mongoose.model('Group', group);