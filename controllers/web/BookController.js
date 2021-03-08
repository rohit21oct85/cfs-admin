const Book = require('../../models/admin/Book.js');

const getAllBook = async(req, res) => {
    try {
        const Books = await Book.find({ status: true }, { __v: 0 });
        return res.status(200).json({
            data: Books
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

module.exports = {
    getAllBook,
}