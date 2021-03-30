const mongoose = require('mongoose');

const FaqContentSchema = new Schema({ question: 'string', answer: 'string' });

const FaqSchema = new mongoose.Schema({
    faq_category: {
        type: String,
        required: true,
    },
    faq_image: {
        type: String,
        required: true,
    },
    faq_content: {
        type: FaqContentSchema
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

module.exports = mongoose.model('SubSubject', FaqSchema);