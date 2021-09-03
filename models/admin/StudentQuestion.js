const mongoose = require('mongoose');

const StudentQuestionSchema = new mongoose.Schema({
    qa_id: {type: String},
    exp_id: {type: String},
    user_id: {type: String},
    sub_child_id: {type: String},
    question: {type: String},
    comments: {type: String},
    answer: {type: String},
    modified: {type: Date},
    ip: {type: String},
    status: {type: String},
    is_assignment: {type: String},
    tstatus: {type: String},
    is_created: {type: String},
    created_at: {type: Date,default: Date.now}
});

module.exports = mongoose.model('StudentQuestion', StudentQuestionSchema);