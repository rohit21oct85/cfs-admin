const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    old_qid:{type: String},
    section_id:{type: String},
    sub_section_id:{type: String},
    source:{type: String},
    sequence:{type: Number},
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
    },
    chapter_name:{
        type: String,
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
    another_answer:{
        type: String,
    },
    expert_answer:{
        type: String,
    },
    answer_uploaded:{
        type: Boolean,
        default: false
    },

    status: {
        type: Boolean,
        default: true
    },
    flag: {
        type: String,
        default: 'notassigned'
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