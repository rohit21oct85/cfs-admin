const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    module_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    role_access:{
        type: Number,
        required: true
    },
    
    icon:{
        type: String
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

module.exports = mongoose.model('Module', ModuleSchema);