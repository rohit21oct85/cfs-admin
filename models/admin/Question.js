const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    old_qid:{type: String},
    uuid:{type: String},
    subject:{type: String},
    subject_id:{type: String},
    sub_subject:{type: String},
    sub_subject_id:{type: String},
    chield_subject_id:{type: String},
    book_isbn:{type: String},
    book_name:{type: String},
    book_edition:{type: String},
    chapter_no:{type: String},
    problem_no:{type: String},
    question:{
        type: String,
    },
    image:{
        type: String,
    },
    shortanswer:{
        type: String,
    },
    completeanswer:{
        type: String,
    },
    price: {
        type: String,
        default: 3
    },
    user_Id: {
        type: String
    },
    user_role: {
        type: String
    },
    type: {
        type: String
    },
    flag: {
        type: String,
        default: 'pending'
    },
    isChecked: {
        type: Boolean,
        default: 0
    },
    status: {
        type: Boolean,
        default: 0
    },
    last_submition: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', QuestionSchema);