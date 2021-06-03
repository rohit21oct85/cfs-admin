const mongoose = require('mongoose');

const RoleModuleSchema = new mongoose.Schema({
    role_name:{
        type: String,
        required: true,
    },
    role_id:{
        type: String,
    },
    module_name: {
        type: String,
    },
    module_slug: {
        type: String,
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

module.exports = mongoose.model('RoleModule', RoleModuleSchema);