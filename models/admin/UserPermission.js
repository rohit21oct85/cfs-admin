const mongoose = require('mongoose');

const UserPermissionSchema = new mongoose.Schema({
    user_name:{
        type: String,
        required: true,
    },
    user_id:{
        type: String,
        required: true,
    },
    permissions: {
        type: [{method: String},{module: String}],
        required: true
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

module.exports = mongoose.model('UserPermission', UserPermissionSchema);