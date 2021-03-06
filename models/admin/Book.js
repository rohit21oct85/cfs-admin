const mongoose = require('mongoose');

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
        type: String,
        required: true
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

module.exports = mongoose.model('Book', BookSchema);