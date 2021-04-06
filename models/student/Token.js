const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TokenSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    token: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: 86400000 }
    }
});

module.exports = mongoose.model('Tokens', TokenSchema);