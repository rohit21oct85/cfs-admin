const Chapter = require('../../models/admin/Chapter.js');
const csv = require('csv-parser')
const fs = require('fs')
const checkValueIndex = (results, checkvalue) => {
    return results.findIndex( data => data.chapter_no === checkvalue);
}

const getChapters = async (isbn) => {
    const chapters = [];
    const map = new Map();
    const results = await Chapter.find({
        "book_isbn": `${isbn}`,
    },{
        _id: 0,
        chapter_no: 1,
        chapter_name: 1
    });
    if(results.length > 0)
    {
        results.forEach( item => {
            if(!map.has(item.chapter_no)){
                map.set(item.chapter_no, true);
                chapters.push({
                    chapter_no: item.chapter_no, 
                    chapter_name: item.chapter_name, 
                })
            }
        });
        return chapters;
    }else{
        return results.length;
    }
}
const getSections = async (isbn, chapter_no) => {
    const results = await Chapter.find({
        "book_isbn": `${isbn}`,
        "chapter_no": `${chapter_no}`,
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
    return sections;
    
}
const getExcerise = async (isbn, chapter_no, section_no) => {
    const results = await Chapter.find({
        "book_isbn": `${isbn}`,
        "chapter_no": `${chapter_no}`,
        "section_no": `${section_no}`,
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
    return excerise;
    
}
const getProblems = async (isbn, chapter_no, section_no, excerise) => {
    const results = await Chapter.find({
        "book_isbn": `${isbn}`,
        "chapter_no": `${chapter_no}`,
        "section_no": `${section_no}`,
        "excerise": `${excerise}`,
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
    return problems;
}

const GetChapterQuestions = async (req, res) => {
    try{
        const chapters = await getChapters(req.params.isbn);
        if(chapters === 0){
            res.status(203).json({
                error: true,
                message: `Questions are Not Uploaded for ISBN 13:  ${req.params.isbn} `,
                book_isbn: req.params.isbn,
                chapters: [],
                sections: [],
                excerise: [],
                problems: []
            })
        }else{
            chapter_no = chapters && chapters[0].chapter_no;
            const sections = await getSections(req.params.isbn, chapter_no);
            section_no = sections[0].section_no;
            const excerise = await getExcerise(req.params.isbn, chapter_no, section_no);
            excerise_no = excerise[0].excerise;
            const problems = await getProblems(req.params.isbn, chapter_no, section_no, excerise_no);

            return res.status(200).json({
                "book_isbn": req.params.isbn,
                chapters,sections,excerise,problems
                
            });
        }
        
    }   catch(e) {
        return res.status(500).json({
            "errors": true,
            "message": "Error found while fatching data",
            "error": e.message
        })
    }
    
}
const UploadChapters = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    
    try {
        let results = [];
        
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach( (chapter, index) => {
                    if(chapter.chapter_no !== '' ){
                        chapter_no = results[index].chapter_no
                        chapter_name = results[index].chapter_name
                    }
                    
                    if(chapter.section_no !== ''){
                        section_no = results[index].section_no
                        section_name = results[index].section_name
                    }
                    
                    if(chapter.excerise !== ''){
                        excerise = results[index].excerise
                    }
                    FinalData.push({ 
                        book_id: data.book_id, 
                        book_name: data.book_name, 
                        book_isbn: data.book_isbn, 
                        chapter_no: chapter_no, 
                        chapter_name: chapter_name, 
                        section_no: section_no, 
                        section_name: section_name.trim(), 
                        excerise: excerise, 
                        problem_no: results[index].problem_no, 
                        question: results[index].question, 
                    })
                })
                
                otherFunction(res, FinalData, function() {
                    fs.unlinkSync(req.file.path)
                })
            });
    } catch (error) {
        return res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const otherFunction = async(res, FinalData, callback) => {
    // return res.send(FinalData);
    await Chapter.insertMany(FinalData).then(() => {
        res.status(200).json({
            success: true,
            message: "Chapters added successfully"
        })
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
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
        "chapter_no": `${req.params.chapter_no}`,
        "section_no": `${req.params.section_no}`,
        "excerise": `${req.params.excerise_no}`,
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
const searchQuestion = async (req, res) => {
    const s = req.params.search;
    const term = s.split('-').join(' ');
    console.log(term);
    const results = await Chapter.find({
        book_isbn: '9780131453401', 
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
    UploadChapters,
    GetChapterQuestions,
    getBookChapters,
    getBookSections,
    getBookExercises,
    getBookProblems,
    searchQuestion
}