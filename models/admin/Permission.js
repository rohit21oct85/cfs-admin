const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    group:{
        type: String,
        required: true,
    },
    group_id:{
        type: String,
        required: true,
    },
    name: {
        type: String,
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
    create_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Permission', PermissionSchema);