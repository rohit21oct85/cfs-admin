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
    // console.log(req.params, req.body.pageno)
    try {
        const total = await Book.countDocuments(Book.find({ sub_subject_name: req.params.sub_subject_name }, { __v: 0 })).collation( { locale: 'en', strength: 2 } );
        const Books = await Book.find({ sub_subject_name: req.params.sub_subject_name }, { __v: 0 }).skip(req.body.pageno * req.body.limit).limit(parseInt(req.body.limit)).collation( { locale: 'en', strength: 2 } );
        return res.status(200).json({
            total: total,
            data: Books
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const searchSubSubject = async(req, res) => {
    // return res.send(req.params);
    try {
        const isbn = req.params.isbn;
        const books = await Book.aggregate([
            {
                "$search":{
                    "autocomplete": {
                        "path": "ISBN13",
                        "query": `${isbn}`,
                    }
                }
            }
            ,{
                $limit: 10
            },{
                $project: {
                    sub_subject_name: 1,
                    BookName: 1,
                    ISBN13: 1,
                    Edition: 1,
                    Author1: 1,
                    score: { $meta: "searchScore" }
                }
            }
        ]);
        return res.status(200).json({
            data: books
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
    searchSubSubject,
}