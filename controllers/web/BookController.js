const Book = require('../../models/admin/Book.js');
const Chapter = require('../../models/admin/Chapter');

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

const PopularBooks = async(req, res) => {
    // return res.send("hasd");
    try {
        const Books = await Book.aggregate([
            { $sample: { size: 4 } }
        ]);
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

const searchChapterQuestion = async (req, res) => {
    // return res.send(req.params);
    const search = req.params.search;
    // return res.send(isbn);
    const questions = await Chapter.find({ 
        $or:
        // [{book_isbn: { $regex: search}},{book_name:{ $regex:search }},{question:{$regex:search}}]
        [{question:{$regex:search}}]
    },{
        _id:0,
        book_id :1,
        book_name:1,
        chapter_no:1,
        chapter_name:1,
        section_no:1,
        section_name:1,
        excerise:1,
        problem_no:1,
        question:1,
        book_isbn:1,
    }).limit(3);

    res.status(200).json({
        questions
    });
}

const searchBookNameIsbn = async (req, res) => {
    // return res.send(req.params);
    const search = req.params.search;
    // return res.send(isbn);
    const books = await Book.find({ 
        $or:
        [{ISBN13: { $regex: search}},{BookName:{ $regex:search }}]
    },{
        _id:0,
        BookName:1,
        ISBN13:1,
        Edition:1,
        Author1:1,
        ISBN10:1,
    }).limit(3);

    res.status(200).json({
        books
    });
}

module.exports = {
    getAllBook,
    BooksBySubSubjectName,
    searchSubSubject,
    PopularBooks,
    searchChapterQuestion,
    searchBookNameIsbn,
}