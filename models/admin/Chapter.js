const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    old_qid:{type: String},
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
        default: true
    },
    flag: {
        type: String,
        Default: 'notassigned'
    },
    temp_answer: {
        type: String,
    },
    option: {
        type: String
    },
    assigned_at: {
        type: Date
    },
    
    assigned_to: {
        type: Object
    },
    
    tutor_name: {
        type: String
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chapter', ChapterSchema);