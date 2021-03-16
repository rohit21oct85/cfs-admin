const Book = require('../../models/admin/Book.js');

const getAllBook = async(req, res) => {
    try {
        const Books = await Book.find({ status: true }, { __v: 0 }).limit(10);
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

const BooksBySubSubjectName = async(req, res) => {
    console.log(req.params, req.body.pageno)
    try {
        const Books = await Book.find({ sub_subject_name: req.params.sub_subject_name }, { __v: 0 }).skip(req.body.pageno * req.body.limit).limit(parseInt(req.body.limit));
        return res.status(200).json({
            total: Books.length,
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
    BooksBySubSubjectName,
}