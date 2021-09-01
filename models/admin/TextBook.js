const mongoose = require('mongoose');

const TextBookSchema = new mongoose.Schema({
    user_Id: {type: String},
    sid: {type: String},
    isbn: {type: String},
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