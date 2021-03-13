const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    book_id: {
        type: Object,
        required: true,
    },
    book_name: {
        type: String,
        required: true,
    },
    book_isbn: {
        type: String,
        required: true,
    },
    chapter_no:{
        type: String,
        required: true,
    },
    chapter_name:{
        type: String,
        required: true,
    },

    section_no:{
        type: String,
        required: true,
    },
    section_name:{
        type: String,
        required: true,
    },
    excerise:{
        type: String,
        required: true,
    },
    problem_no:{
        type: String,
        required: true,
    },
    question:{
        type: String,
        required: true,
    },
    answers:{
        type: String,
    },

    status: {
        type: Boolean,
        required: true,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chapter', ChapterSchema);