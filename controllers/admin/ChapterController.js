const Chapter = require('../../models/admin/Chapter.js');
const csv = require('csv-parser')
const fs = require('fs')

const checkValueIndex = (results, checkvalue) => {
    return results.findIndex( data => data.chapter_no === checkvalue);
}
const getChapters = async (isbn) => {
    try {
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
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}
const getSections = async (isbn, chapter_no) => {
    try {
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
                if(item.section_no){
                    sections.push({
                        section_no: item.section_no, 
                        section_name: item.section_name, 
                    })
                }
            }
        });
        return sections;
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
    
}
const getExcerise = async (isbn, chapter_no, section_no) => {
    try {
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
                if(item.excerise ){
                    excerise.push({
                        excerise: item.excerise 
                    })
                }
            }
        });
        return excerise;
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        }) 
    }
    
}
const getProblems = async (isbn, chapter_no, section_no, excerise) => {
    try {
        const results = await Chapter.find({
            "book_isbn": `${isbn}`,
            "chapter_no": `${chapter_no}`,
            "section_no": `${section_no}`,
            "excerise": `${excerise}`,
        },{
            _id: 1,
            problem_no: 1,
            question: 1,
            answer: 1,
            image: 1
        });
    
        const problems = [];
        
        const map = new Map();
        results.forEach( item => {
            if(!map.has(item.problem_no)){
                map.set(item.problem_no, true);
                if(item.problem_no){
                    problems.push({
                        q_id: item._id, 
                        problem_no: item.problem_no, 
                        question: item.question, 
                        answer: item.answer, 
                        image: item.image, 
                    })
                }
            }
        });
        return problems; 
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        }) 
    }
}
const getOnlyProblems = async (isbn, chapter_no) => {
    try {
        const results = await Chapter.find({
            "book_isbn": `${isbn}`,
            "chapter_no": `${chapter_no}`
        },{
            _id: 1,
            problem_no: 1,
            question: 1,
            answer: 1,
            image: 1
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
                    answer: item.answer, 
                    image: item.image, 
                })
            }
        });
        return problems;
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        }) 
    }
}
const GetChapterQuestions = async (req, res) => {
    try{
        let chapters = [];
        let sections = [];
        let excerise = [];
        let problems = [];
        
        chapters = await getChapters(req.params.isbn);
        if(chapters === 0){
            res.status(203).json({
                error: true,
                message: `Questions are Not Uploaded for ISBN 13:  ${req.params.isbn} `,
                book_isbn: req.params.isbn
            })
        }else{
            chapter_no = chapters && chapters[0].chapter_no;
            sections = await getSections(req.params.isbn, chapter_no);
            if(sections.length > 0){
                section_no = sections[0].section_no;
                excerise = await getExcerise(req.params.isbn, chapter_no, section_no);
                excerise_no = excerise[0].excerise;
                problems = await getProblems(req.params.isbn, chapter_no, section_no, excerise_no);
            }else{
                problems = await getOnlyProblems(req.params.isbn, chapter_no);
            }
            
            return res.status(200).json({
                error: false,
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
    let chapter_no = '';
    let chapter_name = '';
    let section_no = '';
    let section_name = '';
    let excerise = '';
    let problem_no = '';
    let question = '';
    try {
        let results = [];
        
        fs.createReadStream(req.file.path,{encoding: 'utf8'})
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach( (chapter, index) => {
                    // console.log(chapter); return;
                    if(chapter.chapter_no !== '' ){
                        chapter_no = results[index].chapter_no
                    }
                    
                    if(chapter.chapter_name !== '' ){
                        chapter_name = results[index].chapter_name
                    }
                    
                    if(chapter.section_no !== ''){
                        section_no = results[index].section_no
                    }
                    
                    if(chapter.section_name !== ''){
                        section_name = results[index].section_name
                    }

                    
                    if(chapter.excerise !== ''){
                        excerise = results[index].excerise
                    }
                    
                    if(chapter.problem_no !== ''){
                        problem_no = results[index].problem_no
                    }
                    
                    if(chapter.question !== ''){
                        question = results[index].question
                    }
                    FinalData.push({ 
                        book_id: data.book_id, 
                        book_name: data.book_name, 
                        book_isbn: data.book_isbn, 
                        chapter_no: chapter_no, 
                        chapter_name: chapter_name, 
                        section_no: section_no, 
                        section_name: section_name, 
                        excerise: excerise, 
                        problem_no: problem_no, 
                        question: question, 
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
        return res.status(200).json({
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

const UdateChaptersCSV = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    let section_no = '';
    let section_name = '';
    let excerise = '';
    let question = '';
    try {
        let results = [];
        
        fs.createReadStream(req.file.path,{encoding: 'binary'})
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach( (chapter, index) => {
                    if(chapter.section_no !== ''){
                        section_no = results[index].section_no
                        section_name = results[index].section_name
                    }
                    
                    if(chapter.excerise !== ''){
                        excerise = results[index].excerise
                    }
                    
                    if(chapter.question !== ''){
                        question = results[index].question
                    }
                    FinalData.push({ 
                        _id: chapter._id,
                        book_isbn: chapter.book_isbn,
                        section_no: section_no, 
                        section_name: section_name, 
                        excerise: excerise, 
                        problem_no: chapter.problem_no, 
                        question: question, 

                    })
                })
                
                UpdateotherFunction(res, FinalData, function() {
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


const UpdateotherFunction = async(res,FinalData, callback) => {
    try{
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await FinalData.map( data => {
            const id = data._id;
            Chapter.findOneAndUpdate({_id: id},{$set: {
                section_no: data.section_no,
                section_name: data.section_name,
                excerise: data.excerise,
                problem_no: data.problem_no,
                question: data.question,
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        })

        return res.status(409).json({
            error: false,
            message: "Chapter Updated successfully"
        })

        callback();

    }catch(err){
        return res.status(409).json({
            error: true,
            message: err.message
        })
    }
}


const getBookChapters = async (req, res) => {

    try {
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
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}
const getBookSections = async (req, res) => {
    
    try {
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
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}
const getBookExercises = async (req, res) => {
    try {
        const results = await Chapter.find({
            "book_isbn": `${req.params.isbn}`,
            "chapter_no": `${req.params.chapter_no}`,
            "section_no": `${req.params.section_no}`,
        },{
            _id: 0,
            excerise: 1
        });
    
        let excerise = [];
        
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
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
    
}
const getBookProblems = async (req, res) => {
    try {
        const results = await Chapter.find({
            "book_isbn": `${req.params.isbn}`,
            "chapter_no": `${req.params.chapter_no}`,
            "section_no": `${req.params.section_no}`,
            "excerise": `${req.params.excerise_no}`,
        },{
            _id: 1,
            problem_no: 1,
            question: 1,
            answer: 1,
            image: 1
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
                    answer: item.answer, 
                    image: item.image, 
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
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}
const getBookOnlyProblems = async (req, res) => {
   try {
        const results = await Chapter.find({
            "book_isbn": `${req.params.isbn}`,
            "chapter_no": `${req.params.chapter_no}`
        },{
            _id: 1,
            problem_no: 1,
            question: 1,
            answer: 1,
            image: 1
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
                    answer: item.answer, 
                    image: item.image, 
                })
            }
        });
        res.status(200).json({
            isbn: req.params.isbn,
            chapter_no: req.body.chapter_no,
            problems
        });
   } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
   }
}
const searchQuestion = async (req, res) => {
    try {
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
            answer: 1,
            image: 1
        }).limit( 10 );
        const problems = [];
        const map = new Map();
        results.forEach( item => {
            if(!map.has(item.problem_no)){
                map.set(item.problem_no, true);
                problems.push({
                    problem_no: item.problem_no, 
                    question: item.question, 
                    answer: item.answer, 
                    image: item.image, 
                    chapter_no: item.chapter_no, 
                    chapter_name: item.chapter_name, 
                    
                })
            }
        });
        res.status(200).json({
            problems
        });
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        }) 
    }
}
const GetSingleQuestion = async (req, res) => {
    try {
        const results = await Chapter.findOne({
            "_id": `${req.params.q_id}`
        });
        res.status(200).json({
            results
        });
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}
const AddSingleQuestion = async (req, res) => {
    try {
        await Chapter.findByIdAndUpdate({ _id: req.params.q_id }, req.body)
                    .then(response => {
                        return res.status(201).json({
                            message: "Question, Updated"
                        })
                    })
                    .catch(error => {
                        return res.status(500).json({
                            message: "Error Found",
                            errors: error.message
                        })
                    });

    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}
const downloadBooks = async (req, res) => {
    const book_isbn = req.params.isbn;
    const books = await Chapter.find({book_isbn},{__v: 0, status: 0, created_at: 0});
    return res.json({books});
}

const RemoveBookChapters = async (req, res) => {
    try {
        await Chapter.deleteMany({ "book_isbn": req.params.isbn}).then(response => {
            return res.status(201).json({
                message: "subject, deleted successfully"
            })
        });
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}
const getAnsweredTotalNo = async (book_isbn, chapter_no) => {
    const count = await Chapter.count({
        book_isbn: book_isbn,
        chapter_no: chapter_no,
        answered: true,
        assigned: false
    });
    return count;
}

const getQCData = async (req, res) => {
    try {

        let details = await Chapter.aggregate([
            {"$match": {
                "book_isbn": req.params.isbn
            }},
            {"$group": {
                "_id": {
                    "chapter_no": "$chapter_no",
                    "chapter_name":"$chapter_name",
                },
                "count":{
                    "$sum": {
                        $cond: [{
                            $eq: ["$flag", "notassigned"]
                        },1,0]
                    }
                },
                "answered":{
                    "$sum": {
                        $cond: [{
                            $eq: ["$flag", "answered"]
                        },1,0]
                    }
                },
                
                "approved":{
                    "$sum": {
                        $cond: [{
                            $eq: ["$flag", "approved"]
                        },1,0]
                    }
                },
                "rejected":{
                    "$sum": {
                        $cond: [{
                            $eq: ["$flag", "rejected"]
                        },1,0]
                    }
                },
                "reworked":{
                    "$sum": {
                        $cond: [{
                            $eq: ["$flag", "reworked"]
                        },1,0]
                    }
                },

            }},
            {$sort: { _id: 1}}
        ]);
        

        const approved_qc = await Chapter.count({"book_isbn": req.params.isbn,flag: "approved"});
        const rejected_qc = await Chapter.count({"book_isbn": req.params.isbn,flag: "rejected"});
        const reworked_qc = await Chapter.count({"book_isbn": req.params.isbn,flag:"reworked"});
        const pending_qc = await Chapter.count({"book_isbn": req.params.isbn,flag: "answered"});
        const total_qc = await Chapter.count({"book_isbn": req.params.isbn, flag: "notassigned"});
        res.status(201).json({
            error: false,
            data: {
                "total_question": total_qc,
                "total_pending_qc": pending_qc,
                "total_solved": approved_qc,
                "total_rejected": rejected_qc,
                "total_reworked": reworked_qc,
                "details": details
            }
        })
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}

const GetQCChapterQuestions = async (req, res) => {
     
    try {
        const filter = {
            "book_isbn": req.params.isbn, 
            "chapter_no": req.params.chapter_no
        };
        const status = req.params.status;
        filter.flag = status

        await Chapter.find(filter,{
            _id: 1,
            problem_no: 1, 
            question: 1, 
            chapter_name: 1,
            temp_answer: 1,
            flag:1
        }).then(response => {
            res.status(201).json({
                error: false,
                data: response
            })
        }).catch(err => {
            res.status(201).json({
                error: true,
                message: err.message
            })
        });
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}

const QCAnswer = async (req, res) => {
    try {
        const data = {flag: req.body.flag}
        if(req.body.option === 'other'){
            data.option = req.body.other_data;
        }
        if(req.body.flag === 'rejected'){
            data.assigned_to = '';
        }
        const filter = {_id: req.body.question_id}
        await Chapter.findOneAndUpdate(filter, data);
        res.status(201).json({
            error: false,
            message: `answer ${req.body.flag} successfully`
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        })
    }


    
}
const clearFields = async (req, res) => {
    await Chapter.updateMany({},
        {$unset: {
        "flag": "",
        "option": "",
        "assigned_to": "",
        "assigned_at": ""
    }});

    res.status(201).json({
        error: false,
        message: "field cleared"
    })
}
const addFields = async (req, res) => {

    await Chapter.updateMany({},
    {
        "flag": "notassigned",
        "option": "",
        "assigned_to": "",
        "assigned_at": null
    });
    res.status(201).json({
        error: false,
        message: "field cleared"
    });
}


module.exports = {
    UploadChapters,
    UdateChaptersCSV,
    GetChapterQuestions,
    getBookChapters,
    getBookSections,
    getBookExercises,
    getBookProblems,
    GetSingleQuestion,
    AddSingleQuestion,
    getBookOnlyProblems,
    searchQuestion,
    downloadBooks,
    RemoveBookChapters,
    getQCData,
    GetQCChapterQuestions,
    QCAnswer,
    clearFields,
    addFields
}