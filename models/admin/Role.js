const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role:{
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role', RoleSchema);