const Chapter = require('../../models/admin/Chapter.js');

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
        "chapter_no": `${req.body.chapter_no}`,
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
        "chapter_no": `${req.body.chapter_no}`,
        "section_no": `${req.body.section_no}`,
    },{
        _id: 0,
        excerise: 1
    });

    const excerise = [];
    
    const map = new Map();
    results.forEach( item => {
        if(!map.has(item.excerise)){
            map.set(item.excerise, true);
            excerise.push({
                excerise: item.excerise 
            })
        }
    });
    res.status(200).json({
        isbn: req.params.isbn,
        chapter_no: req.body.chapter_no,
        section_no: req.body.section_no, 
        excerise
    });
    
}
const getBookProblems = async (req, res) => {
    const results = await Chapter.find({
        "book_isbn": `${req.params.isbn}`,
        "chapter_no": `${req.body.chapter_no}`,
        "section_no": `${req.body.section_no}`,
        "excerise": `${req.body.excerise}`,
    },{
        _id: 0,
        problem_no: 1,
        question: 1,
    });

    const problems = [];
    
    const map = new Map();
    results.forEach( item => {
        if(!map.has(item.problem_no)){
            map.set(item.problem_no, true);
            problems.push({
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


module.exports = {
    getBookChapters,
    getBookSections,
    getBookExercises,
    getBookProblems
}