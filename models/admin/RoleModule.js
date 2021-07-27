const mongoose = require('mongoose');

const RoleModuleSchema = new mongoose.Schema({
    email: {
        type: String
    },
    role: {
        type: Number
    },
    role_name:{
        type: String
    },
    role_id:{
        type: String,
    },
    module_id: {
        type: String,
    },
    module_name: {
        type: String,
    },
    module_slug: {
        type: String,
    },
    module_icon: {
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