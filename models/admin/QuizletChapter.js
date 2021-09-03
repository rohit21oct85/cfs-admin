const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
    chapter_no: String,
    section_no: String,
    section_name: String,
    book_isbn: String,
    exe_uploaded: {
        type: Number
    },
    answer_uploaded: {
        type: Number
    }
})
const QuizletChapterSchema = new mongoose.Schema({
    book_isbn: {
        type: String,
    },
    chapter_no:{
        type: String,
    },
    chapter_name:{
        type: String,
    },
    sec_uploaded: {
        type: Number,
        default: 0
    },
    exe_uploaded: {
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
        default: 0
    },
    total_section: {
        type: Number
    },
    sections: {
        type: [sectionSchema]
    }

});

module.exports = mongoose.model('QuizletChapter', QuizletChapterSchema);