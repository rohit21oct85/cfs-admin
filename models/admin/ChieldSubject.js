const mongoose = require('mongoose');

const ChieldSubjectSchema = new mongoose.Schema({
    subject: {
        type: String,
    },
    subject_id: {
        type: String,
    },
    sub_subject: {
        type: String,
    },
    sub_subject_id: {
        type: String,
    },
    chield_subject_id: {
        type: String
    },
    chield_subject: {
        type: String
    },
    toal_question: {
        type: Number,
        default: 0
    },
    total_uploaded: {
        type: Number,
        default: 0
    },
    total_page: {
        type: Number,
        default: 0
    },
    page_uploaded: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChieldSubject', ChieldSubjectSchema);