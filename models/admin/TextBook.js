const mongoose = require('mongoose');

const TextBookSchema = new mongoose.Schema({
    user_Id: {type: String},
    book_isbn: {type: String},
    book_name: {type: String},
    edition: {type: String},
    inStock:{
        type: Boolean
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TextBook', TextBookSchema);