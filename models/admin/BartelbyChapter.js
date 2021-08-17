const mongoose = require('mongoose');

const BartelbyChapterSchema = new mongoose.Schema({
    book_isbn: {
        type: String,
    },
    section_id:{
        type: String,
    },
    chapter_no:{
        type: String,
    },
    chapter_name:{
        type: String,
    },
    uploaded: {
        type: Number,
        default: 0
        
    },
    answer_uploaded: {
        type: Number,
        default: 0
    },
    total_question: {
        type: Number,
        default: 0
    },
    total_uploaded: {
        type: Number,
        default: 1
    }

});

module.exports = mongoose.model('BartelbyChapter', BartelbyChapterSchema);