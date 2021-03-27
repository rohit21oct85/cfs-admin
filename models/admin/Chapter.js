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
    },
    section_name:{
        type: String,
    },
    excerise:{
        type: String,
    },
    problem_no:{
        type: String,
    },
    question:{
        type: String,
    }, 
    image:{
        type: String,
    },

    answer:{
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