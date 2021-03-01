const mongoose = require('mongoose');

const PermissionGroupSchema = new mongoose.Schema({
    module_id: {
        type: String,
        required: true,
    },
    module_name: {
        type: String,
        required: true,
    },
    module_method: {
        type: [{name: String}],
        required: true
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

module.exports = mongoose.model('PermissionGroup', PermissionGroupSchema);