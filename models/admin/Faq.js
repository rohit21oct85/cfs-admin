const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const FaqContentSchema = new mongoose.Schema({ question: 'string', answer: 'string' });

const FaqSchema = new mongoose.Schema({
    faq_category: {
        type: String,
        required: true,
    },
    faq_image: {
        type: String,
    },
    faq_content: {
        type: [FaqContentSchema]
    },
    status: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
FaqSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Faq', FaqSchema);