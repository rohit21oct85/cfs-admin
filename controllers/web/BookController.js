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

const getBook = async(req, res) => {
    // return res.send(req.params.isbn)
    try {
        const Books = await Book.find({ ISBN13: req.params.isbn, status: true }, { __v: 0 });
        // const ratingAverage = Books[0].reviews.length;
        // return res.send(Books[0].reviews.length)
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

const popularBooks = async(req, res) => {
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
    const search = req.params.search;
    const limit = parseInt(req.params.limit);
    // return res.send(req.params)

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
    }).limit(limit);

    res.status(200).json({
        questions
    });
}

const searchBookNameIsbn = async (req, res) => {
    const search = req.params.search;
    const limit = parseInt(req.params.limit);
    // return res.send(req.params)
    const books = await Book.find({ 
        $or:
        // [{ISBN13: { $regex: /^search$/i}},{BookName:{ $regex:/^search$/i }}]
        [{ISBN13: { $regex: search}},{BookName:{ $regex:search }}]
    },{
        _id:0,
        BookName:1,
        ISBN13:1,
        Edition:1,
        Author1:1,
        ISBN10:1,
    }).limit(limit);

    res.status(200).json({
        books
    });
}

const getBookChapters = async (req, res) => {

    const chapters = [];
    const map = new Map();
    const results = await Chapter.find({
        "book_isbn": `${req.params.isbn}`,
    },{
        _id: 0,
        chapter_no: 1,
        chapter_name: 1
    });
    results.forEach( item => {
        if(!map.has(item.chapter_no)){
            map.set(item.chapter_no, true);
            chapters.push({
                chapter_no: item.chapter_no, 
                chapter_name: item.chapter_name, 
            })
        }
    });
    res.status(200).json({
        isbn: req.params.isbn,
        chapters
    });
}

const getBookSections = async (req, res) => {
    
    const results = await Chapter.find({
        "book_isbn": `${req.params.isbn}`,
        "chapter_no": `${req.params.chapter_no}`,
    },{
        _id: 0,
        section_no: 1,
        section_name: 1
    });

    const sections = [];
    
    const map = new Map();
    results.forEach( item => {
        if(!map.has(item.section_no)){
            map.set(item.section_no, true);
            sections.push({
                section_no: item.section_no, 
                section_name: item.section_name, 
            })
        }
    });
    res.status(200).json({
        isbn: req.params.isbn, 
        chapter_no: req.body.chapter_no, 
        sections});
}

const getBookExercises = async (req, res) => {
    const results = await Chapter.find({
        "book_isbn": `${req.params.isbn}`,
        "chapter_no": `${req.params.chapter_no}`,
        "section_no": `${req.params.section_no}`,
    },{
        _id: 0,
        excerise: 1
    });

    let excerises = [];
    
    const map = new Map();
    results.forEach( item => {
        if(!map.has(item.excerise)){
            map.set(item.excerise, true);
            excerises.push({
                excerise: item.excerise 
            })
        }
    });
    res.status(200).json({
        isbn: req.params.isbn,
        chapter_no: req.body.chapter_no,
        section_no: req.body.section_no, 
        excerises
    });
    
}

const getBookProblems = async (req, res) => {
    const results = await Chapter.find({
        "book_isbn": `${req.params.isbn}`,
        "chapter_no": `${req.params.chapter_no}`,
        "section_no": `${req.params.section_no}`,
        "excerise": `${req.params.excerise_no}`,
    },{
        _id: 1,
        problem_no: 1,
        question: 1,
    });

    const problems = [];
    
    const map = new Map();
    results.forEach( item => {
        if(!map.has(item.problem_no)){
            map.set(item.problem_no, true);
            problems.push({
                q_id: item._id, 
                problem_no: item.problem_no, 
                question: item.question, 
            })
        }
    });
    res.status(200).json({
        isbn: req.params.isbn,
        chapter_no: req.body.chapter_no,
        section_no: req.body.section_no, 
        excerise: req.body.excerise,
        problems
    });
}

const getBookOnlyProblems = async (req, res) => {
    const results = await Chapter.find({
        "book_isbn": `${req.params.isbn}`,
        "chapter_no": `${req.params.chapter_no}`
    },{
        _id: 1,
        problem_no: 1,
        question: 1,
    });

    const problems = [];
    
    const map = new Map();
    results.forEach( item => {
        if(!map.has(item.problem_no)){
            map.set(item.problem_no, true);
            problems.push({
                q_id: item._id, 
                problem_no: item.problem_no, 
                question: item.question, 
            })
        }
    });
    res.status(200).json({
        isbn: req.params.isbn,
        chapter_no: req.body.chapter_no,
        problems
    });
}

const relatedBooks = async(req, res) => {
    try {
        const Books = await Book.aggregate([
            {$match: {sub_subject_name: `${req.params.sub_subject}`}},
            { $sample: { size: 4 } }
        ])
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

const searchQuestion = async (req, res) => {
    const s = req.params.search;
    const isbn = req.params.isbn;
    const results = await Chapter.find({
        book_isbn: isbn, 
        question: { $regex: s }
    },{
        _id: 0,
        problem_no: 1,
        question: 1,
        chapter_no: 1,
        chapter_name: 1,
    }).limit( 10 );
    const problems = [];
    const map = new Map();
    results.forEach( item => {
        if(!map.has(item.problem_no)){
            map.set(item.problem_no, true);
            problems.push({
                problem_no: item.problem_no, 
                question: item.question, 
                chapter_no: item.chapter_no, 
                chapter_name: item.chapter_name, 
                
            })
        }
    });
    res.status(200).json({
        problems
    });
}

module.exports = {
    getAllBook,
    getBook,
    BooksBySubSubjectName,
    searchSubSubject,
    popularBooks,
    searchChapterQuestion,
    searchBookNameIsbn,
    getBookChapters,
    getBookSections,
    getBookExercises,
    relatedBooks,
    getBookProblems,
    getBookOnlyProblems,
    searchQuestion,
}