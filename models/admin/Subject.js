const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    total_books: {
        type: Number,
        default: 0,
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);