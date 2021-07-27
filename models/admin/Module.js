const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    module_name: {
        type: String,
        required: true,
    },
    module_slug: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    icon:{
        type: String
    },
    
    showMenu:{
        type: Boolean,
        default: true
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