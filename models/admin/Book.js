const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ReviewSchema = new mongoose.Schema({ 
    rating: 'Number', 
    review: 'string', 
    userName: 'string', 
    status: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    } 
});

const FAQSchema = new mongoose.Schema({ 
    question: 'string', 
    answer: 'string', 
    status: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    } 
});
const SimilarBooksSchema = new mongoose.Schema({ 
    ISBN13:'string',
    BookId:'string',
    Edition:'string',
    DisplayTitle: 'string',
    AltImage: 'string',
    status: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    } 
});

const BookSchema = new mongoose.Schema({
    subject_id: {
        type: Object,
        required: true,
    },
    subject_name: {
        type: String,
        required: true,
    },
    sub_subject_id: {
        type: Object,
        required: true,
    },
    sub_subject_name: {
        type: String,
        required: true,
    },
    BookName: {
        type: String
    },
    BookEdition: {
        type: String,
    },
    Edition: {
        type: String,
    },
    ISBN13: {
        type: String,
        required: true
    },
    ISBN10: {
        type: String,
        
    },
    reviews: {
        type: [ReviewSchema]
    },
    faqs: {
        type: [FAQSchema]
    },
    image: {
        type: String,
    },
    image2: {
        type: String,
    },
    extra_search: {
        type: String,
    },
    Author1: {
        type: String,
    },
    Author2: {
        type: String,
    },
    Author3: {
        type: String,
    },
    Description: {
        type: String,
    },
    MetaTitle: {
        type: String,
    },
    MetaKeywords: {
        type: String,
    },
    MetaDescription: {
        type: String,
    },
    NoIndex: {
        type: String,
    },
    urls: {
        type: String,
    }, 
    DisplayTitle: {
        type: String,
    },
    AltImage:{
        type: String,
    }, 
    status: {
        type: Boolean,
        default: true
    },
    seo:{
        type: Boolean,
        default: false
    },
    similarHeading: {
        type: String
    },
    
    faqHeading: {
        type: String
    },

    similarBooks: {
        type: [SimilarBooksSchema]
    },
    published: {
        type: Boolean,
    },
    question_uploaded: {
        type: Boolean,
    },
    total_question: {
        type: Number,
        default: 0
    },
    source:{
        type: String
    },
    bartlyby_imported: {
        type: Boolean
    },
    quizlet_imported: {
        type: Boolean
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

BookSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Book', BookSchema);