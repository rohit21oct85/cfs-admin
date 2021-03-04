const mongoose = require('mongoose');

const RolePermissionSchema = new mongoose.Schema({
    role_name:{
        type: String,
        required: true,
    },
    role_id:{
        type: String,
        required: true,
    },
    permissions: {
        type: [{method_name: String, module_name: String}],
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

module.exports = mongoose.model('RolePermission', RolePermissionSchema);