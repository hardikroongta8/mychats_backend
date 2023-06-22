const mongoose = require('mongoose');

const msg =  new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        required: true
    },
    sendingTime: {
        type: String,
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        required: true
    },
});

module.exports = mongoose.model('GroupMessage', msg);