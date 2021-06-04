const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const UploadQuestionSchema = new mongoose.Schema({
    
    isbn: {
        type: String,
    },
    question_uploaded: {
        type: Boolean,
    },
    total_question: {
        type: Number,
        default: 0
    },
    bartlyby_imported: {
        type: Boolean,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

UploadQuestionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('UploadQuestion', UploadQuestionSchema);