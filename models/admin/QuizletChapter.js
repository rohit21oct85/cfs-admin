const mongoose = require('mongoose');

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
    }

});

module.exports = mongoose.model('QuizletChapter', QuizletChapterSchema);