const BartelbyChapter = require('../../models/admin/BartelbyChapter.js');
const Chapter = require('../../models/admin/Chapter.js');
const Book = require('../../models/admin/Book.js');
const csv = require('csv-parser')
const fs = require('fs');
const QuizletChapter = require('../../models/admin/QuizletChapter.js');

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
        return ({
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
    
        let sections = [];
        
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
        if(sections[0].section_no == "NULL"){
            sections = [];
        }
        return sections;
    } catch (error) {
        return ({
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
        return ({
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
            old_qid: 1,
            problem_no: 1,
            question: 1,
            answer: 1,
            image: 1,
            source:1
        });
    
        const problems = [];
        
        const map = new Map();
        results.forEach( item => {
            if(!map.has(item.problem_no)){
                map.set(item.problem_no, true);
                if(item.problem_no){
                    problems.push({
                        q_id: item._id, 
                        old_qid: item.old_qid, 
                        problem_no: item.problem_no, 
                        question: item.question, 
                        answer: item.answer, 
                        image: item.image, 
                        source: item.source, 
                    })
                }
            }
        });
        return problems; 
    } catch (error) {
        return ({
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
            old_qid:1,
            problem_no: 1,
            question: 1,
            answer: 1,
            source: 1,
            image: 1
        });
    
        const problems = [];
        
        const map = new Map();
        results.forEach( item => {
            if(!map.has(item.problem_no)){
                map.set(item.problem_no, true);
                problems.push({
                    q_id: item._id, 
                    old_qid: item.old_qid, 
                    problem_no: item.problem_no, 
                    question: item.question, 
                    answer: item.answer, 
                    image: item.image, 
                    source: item.source, 
                })
            }
        });
        return problems;
    } catch (error) {
        return ({
            error: true,
            code: 501,
            message: error.message
        }) 
    }
}
const getBooksProblems = async (isbn, chapter_no,section_no) => {
    try {
        const results = await Chapter.find({
            "book_isbn": `${isbn}`,
            "chapter_no": `${chapter_no}`,
            "section_no": `${section_no}`
        },{
            _id: 1,
            old_qid:1,
            problem_no: 1,
            question: 1,
            answer: 1,
            source: 1,
            image: 1
        });
    
        const problems = [];
        
        const map = new Map();
        results.forEach( item => {
            if(!map.has(item.problem_no)){
                map.set(item.problem_no, true);
                problems.push({
                    q_id: item._id, 
                    old_qid: item.old_qid, 
                    problem_no: item.problem_no, 
                    question: item.question, 
                    answer: item.answer, 
                    source: item.source, 
                    image: item.image, 
                })
            }
        });
        return problems;
    } catch (error) {
        return ({
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
            chapter_no = chapters[0]?.chapter_no;
            sections = await getSections(req.params.isbn, chapter_no);
            if(sections.length > 0){
                section_no = sections[0].section_no;
                excerise = await getExcerise(req.params.isbn, chapter_no, section_no);
                if(excerise.length > 0 && section_no != NULL){
                    excerise_no = excerise[0].excerise;
                    problems = await getProblems(req.params.isbn, chapter_no, section_no, excerise_no);
                }else{
                    problems = await getOnlyProblems(req.params.isbn, chapter_no);
                }
            }else{
                problems = await getOnlyProblems(req.params.isbn, chapter_no);
            }
            
            return res.status(200).json({
                error: false,
                "book_isbn": req.params.isbn,
                chapters,sections,excerise,problems
                
            });
        }
        
    } catch(e) {
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
            .on('end', async () => {
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
                    
                    
                    question = results[index].question
                
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
                await Book.findByIdAndUpdate({_id: data.book_id},{
                    "question_uploaded": true,
                    "total_question": FinalData.length
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
                question: data.question
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
        if(sections[0].section_no == "NULL"){
            sections = [];
        }
        problems = await getOnlyProblems(req.params.isbn, req.params.chapter_no);
        res.status(200).json({
            isbn: req.params.isbn, 
            chapter_no: req.body.chapter_no, 
            sections,
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
const getBookExercises = async (req, res) => {
    try {
        const results = await Chapter.find({
            "book_isbn": `${req.params.isbn}`,
            "chapter_no": `${req.params.chapter_no}`,
            "section_no": `${req.params.section_no}`,
        },{
            _id: 0,
            excerise: 1,
            problem_no:1,
            question:1
        });
    
        let excerise = [];
        let problems = [];
        
        const map = new Map();

        results.forEach( item => {
            if(!map.has(item.excerise)){
                map.set(item.excerise, true);
                excerise.push({excerise: item.excerise })
            }
        });

        
        problems = await getBooksProblems(req.params.isbn, req.params.chapter_no, req?.params?.section_no);
        res.status(200).json({
            isbn: req.params.isbn,
            chapter_no: req.body.chapter_no,
            section_no: req.body.section_no, 
            excerise,
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
            source: 1,
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
                    source: item.source, 
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
            source: 1,
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
                    source: item.source, 
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
            source: 1,
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
                    source: item.source, 
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

    // await Chapter.updateMany({},{answer_uploaded: false});
    // await BartelbyChapter.updateMany({},{answer_uploaded: 0});
    res.status(201).json({
        error: false,
        message: "field cleared"
    });
}
const importChapter = async (req, res) => {
    // return res.send(req.body)
    try {
        const data = req.body;
        await Chapter.insertMany(data);
        await Book.findByIdAndUpdate({_id: data[0].book_id},{
            "question_uploaded": true,
            "total_question": data.length
        });

        res.status(201).json({
            error: false,
            status: 201,
            message: "Chapter Added successfully"
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}

const SaveBartlebyChapters = async (req, res) => {
    try {
        
        let FinalData = req.body.bartley;
        let filter = {book_isbn: req.body.book_isbn};
        // res.send(FinalData); return;
        let count = await BartelbyChapter.count(filter) ;
        let Chaptercount = await Chapter.count(filter) ;
        
        if(count === 0 && Chaptercount === 0){
            await BartelbyChapter.insertMany(FinalData);
            await Book.findOneAndUpdate({ISBN13: req?.body?.book_isbn},{bartlyby_imported: 1})
            res.status(201).json({
                error: false,
                status: 201,
                message: 'chapter inserted'
            })
        }

    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error
        })
    }
}


const BartelbyChapters = async (req, res) => {
    try {
        let filter = {};
        let data;
        if(req?.params?.status === "import-chapter"){
            filter = {book_isbn: req.params.isbn, uploaded: 0};
            data = await BartelbyChapter.find(filter);
        }else if(req?.params?.status === "view-uploaded-chapter"){
            filter = {book_isbn: req.params.isbn, uploaded: 1, answer_uploaded: 0};
            data = await BartelbyChapter.find(filter);
            if(data?.length === 0){
                const chapters = [];
                const map = new Map();
                const results = await Chapter.find({
                    "book_isbn": `${req.params.isbn}`,
                },{
                    _id: 1,
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
                data = chapters
            }
        }
        
            
        
        res.status(201).json({
            error: false,
            status: 201,
            data: data
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}


const BartelbyUpdatesChapters = async (req, res) => {
    try {
        const filter = {
            book_isbn: req.body.book_isbn, 
            section_id: req.body.section_id,
            sub_section_id: req.body.sub_section_id
        };
        const updateData = {
            uploaded: 1,
            total_uploaded: 1,
            total_section_uploaded: 1,
        }
        await BartelbyChapter.findOneAndUpdate(filter,updateData);
        res.status(201).json({
            error: false,
            status: 201,
            message: "updated"
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}

const BartelbyImportChapter = async (req, res) => {
    
    try {
        const FinalData = req?.body?.chapters;
        const book_isbn = req?.body?.book_isbn;
        const section_id = req?.body?.section_id;
        const sub_section_id = req?.body?.sub_section_id;
        let filter, filterupdate;
        if(sub_section_id){
            filter = {
                book_isbn: book_isbn,
                section_id: section_id,
                sub_section_id: sub_section_id,
            }
        }else{
            filter = {
                book_isbn: book_isbn,
                section_id: section_id
            }
        }
        filterupdate = {
            book_isbn: book_isbn,
            section_id: section_id
        }
        
        const countChapter = await Chapter.find(filter).countDocuments();
        let message = '';
        if(countChapter > 0){
            var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
            await FinalData.map( data => {
                Chapter.findOneAndUpdate(filter,{$set: {
                    sequence: data.sequence,
                    source: data.source,
                    section_id: data.section_id,
                    sub_section_id: data.sub_section_id,
                    chapter_no: data.chapter_no,
                    chapter_name: data.chapter_name,
                    section_no: data.section_no,
                    section_name: data.section_name,
                    problem_no: data.problem_no,
                    question: data.question,
                    answer: data.answer,
                    answer_uploaded: data.answer_uploaded,
                }}, options, async (err, result) => {
                    if(err){
                        return res.status(409).json({
                            message: "Error occured",
                            error: err.message
                        }); 
                    }
                });
            })
            message = "Chapter Updated successfully";
        }else{
            await Chapter.insertMany(FinalData);
            message = "Chapter Added successfully";
        }

        const uploaded = await Book.findOne({_id: FinalData[0].book_id});
        await Book.findByIdAndUpdate({_id: FinalData[0].book_id},{
            "question_uploaded": true,
            "total_question": +uploaded?.total_question + +FinalData?.length
        });
        let bSub = await BartelbyChapter.findOne(filterupdate);
        let totalSubSec = bSub?.total_section_uploaded + 1;
        let finalSubData = bSub?.total_question + +FinalData?.length; 
        await BartelbyChapter.findOneAndUpdate(filterupdate,{
            "total_question": finalSubData,
            "total_uploaded": 1,
            "total_section_uploaded": totalSubSec 
        });
        let updatedSection = await BartelbyChapter.findOne(filterupdate);
        if(updatedSection?.total_section_uploaded === updatedSection?.total_sections){
            await BartelbyChapter.findOneAndUpdate(filterupdate,{
                "uploaded": 1
            })
        }

        res.status(201).json({
            error: false,
            status: 201,
            message: message
        })
        
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const BartelbyProblems = async (req, res) => {
    try {
        let filter;
        let singleBook = await Book.findOne({
            "ISBN13": req?.params?.book_isbn
        })
        if(singleBook?.bartlyby_imported === true){
            if(req?.params?.sub_section_id){
                filter = {
                    book_isbn: req?.params?.book_isbn,
                    section_id: req?.params?.section_id,
                    sub_section_id: req?.params?.sub_section_id,
                    answer_uploaded: false  
                }
            }else{
                filter = {
                    book_isbn: req?.params?.book_isbn,
                    section_id: req?.params?.section_id,
                    answer_uploaded: false  
                }
            }
        }else{
            filter = {
                book_isbn: req?.params?.book_isbn,
                chapter_no: req?.params?.section_id,
                answer_uploaded: false  
            }
        }
        
        const data = await Chapter.find(filter,{
            _id: 1,
            sequence: 1,
            problem_no: 1,
            question: 1,
        }).sort({
            sequence: 1,
        })
        res.status(201).json({
            error: false,
            status: 201,
            data: data
        })
        
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const BartelbyQuestionAnswers = async (req, res) => {
    try {
        const projection = {
            _id: 1,
            chapter_name: 1,
            chapter_no:1 ,
            problem_no: 1,
            question: 1,
            answer: 1,
            expert_answer: 1,
            sequence:1
        }
        const data = await Chapter.find({
            _id: req?.params?.question_id
        },projection);

        res.status(201).json({
            error: false,
            status: 201,
            data: data
        })
        
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}


const BartelbyChaptersChangeStatus = async (req, res) => {
    try {
        let section_id = req?.body?.section_id;
        let book_isbn = req?.body?.book_isbn;
        
        await BartelbyChapter.findOneAndUpdate({
            section_id: section_id, 
            book_isbn: book_isbn
        },{
            uploaded: 0,
            total_uploaded: 1
        });
        
        res.status(201).json({
            error: false,
            status: 201,
            message: "status Changed"
        })
        
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const BartelbyClearChapters = async (req, res) => {
    try {
        let section_id = req?.body?.section_id;
        let book_isbn = req?.body?.book_isbn;
        const total_chapters = await Chapter.count({book_isbn: book_isbn, section_id: section_id, source: 'bartelby'});
        await BartelbyChapter.findOneAndUpdate({
            section_id: section_id, 
            book_isbn: book_isbn
        },{uploaded: 0, total_question: 0, total_uploaded: 0});
        
        const uploaded = await Book.findOne({ISBN13: book_isbn});
        
        await Book.findOneAndUpdate({ISBN13: book_isbn},{total_question: +uploaded?.total_question - +total_chapters});
        res.status(201).json({
            error: false,
            status: 201,
            message: "Chapter Cleared"
        })
        
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const BartelbyDeleteAllChapters = async (req, res) => {
    try {
        let book_isbn = req?.body?.book_isbn;
        await BartelbyChapter.deleteMany({book_isbn: book_isbn});
        await QuizletChapter.deleteMany({book_isbn: book_isbn});
        await Chapter.deleteMany({book_isbn: book_isbn});
        await Book.findOneAndUpdate({ISBN13: book_isbn},{
            total_question: 0, 
            bartlyby_imported: false, 
            quizlet_imported: false, 
            question_uploaded: false
        });
        
        res.status(201).json({
            error: false,
            status: 201,
            message: "Chapter Cleared"
        })
        
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const BartelbyClearAllChapters = async (req, res) => {
    try {
        let book_isbn = req?.body?.book_isbn;
        await BartelbyChapter.updateMany({book_isbn: book_isbn},{uploaded: 0, total_question: 0, total_uploaded: 0},{multi: true});
        await Book.findOneAndUpdate({ISBN13: book_isbn},{total_question: 0});
        
        res.status(201).json({
            error: false,
            status: 201,
            message: "Chapter Cleared"
        })
        
    } catch (error) {
        res.status(505).json({
            error: true,
            status: 505,
            message: error.message
        })
    }
}
const BartelbyUpdateChaptersAnswer = async (req, res) => {
    try {
        let question_id = req?.body?.question_id;
        let expert_answer = req?.body?.expert_answer;
        let question = req?.body?.question;
        let source = req?.body?.source;
        const ChapterData = await Chapter.findOne({_id: question_id,source: 'bartelby'});
        let isbn = ChapterData?.ISBN13;
        let books = await Book.findOne({
            ISBN13: isbn
        })
        let updateData;
        if(source === 'bartelby'){
            updateData = {
                answer: expert_answer,
                question:question,
                answer_uploaded: true
            }
        }else{
            updateData = {
                another_answer: expert_answer,
                question:question,
                answer_uploaded: true
            }
        }
        await Chapter.findByIdAndUpdate({_id: question_id,source: 'bartelby'},updateData);
        if(books?.bartlyby_imported){
            const BChapterSectionID = ChapterData?.section_id
            const BChapter = await BartelbyChapter.findOne({section_id: BChapterSectionID});
            const ChapterCount = await BartelbyChapter.find({section_id: BChapterSectionID}).countDocuments();
            const total_uploaded = BChapter?.total_uploaded;
            const total_question = BChapter?.total_question;
            const sequence = ChapterData?.sequence;

            if(total_question === ChapterCount){
                await BartelbyChapter.findOneAndUpdate({section_id: BChapterSectionID},{
                    answer_uploaded: 1
                });
            }
            await BartelbyChapter.findOneAndUpdate({section_id: BChapterSectionID},{
                total_uploaded: total_uploaded + 1
            });
        }
        
        res.status(201).json({
            error: false,
            status: 201,
            message: "Answer Updated"
        })
        
    } catch (error) {
        res.status(505).json({
            error: true,
            status: 505,
            message: error.message
        })
    }
}
const SaveQuizletAnswer = async (req, res) => {
    try {
        let chapter_id = req?.body?.chapter_id;
        let section_id = req?.body.section_id;
        
        let isbn = req?.body.book_isbn;
        let singleBook = await Book.findOne({
            ISBN13: isbn
        });
        if(req?.body?.type === 'quizlet'){
            await Chapter.findOneAndUpdate({
                book_isbn: req?.body.book_isbn,
                book_id: req?.body.book_id,
                problem_no: req?.body.problem_no,
            },{
                book_id: req?.body.book_id,
                book_name: req?.body.book_name,
                book_isbn: req?.body.book_isbn,
                chapter_no: req?.body.chapter_no,
                chapter_name: req?.body.chapter_name,
                section_id: req?.body.section_id,
                section_no: req?.body.section_no,
                section_name: req?.body.section_name,
                problem_no: req?.body.problem_no,
                question: req?.body.question,
                answer: req?.body.answer,
                answer_uploaded: req?.body.answer_uploaded,
                flag: req?.body.flag,
                source: req?.body.source,
            });
            
            let quizlet = await QuizletChapter.findOne({
                _id: chapter_id
            });
    
            let total_questionQuizlet = quizlet?.total_question + 1
            await QuizletChapter.findOneAndUpdate({
                _id: chapter_id, book_isbn: isbn
            },{
                total_question: total_questionQuizlet
            });
            
            let quizChapter = await QuizletChapter.findOne({"_id": chapter_id});
            if(quizChapter?.total_section > 0){
                let quizletSection = await quizChapter.sections.id(section_id);
    
                let total_quizletSection = quizletSection?.answer_uploaded + 1
                
                await QuizletChapter.findById(chapter_id, function(err, result){
                    if(err){
                        res.status(404).send('Chapter Not found');
                    }else{
                        result.sections.id(section_id).answer_uploaded = total_quizletSection;
                        result.save(function(saveerr, saveresult) {
                            if (!saveerr) {
                              res.status(200).send(saveresult);
                            } else {
                              res.status(400).send(saveerr.message);
                            }
                          });
                    }
                });    
            }
            let total_question = singleBook?.total_question + 1
            await Book.findOneAndUpdate({
                ISBN13: isbn
            },{
                total_question: total_question
            })
            res.status(200).json({
                status: res?.statusCode,
                message: "updated chapters question"
            });
        }else{
            await Chapter.findByIdAndUpdate({
                _id: req?.body?.question_id
            },{
                book_id: req?.body.book_id,
                book_name: req?.body.book_name,
                book_isbn: req?.body.book_isbn,
                chapter_no: req?.body.chapter_no,
                chapter_name: req?.body.chapter_name,
                section_no: req?.body.section_no,
                section_name: req?.body.section_name,
                problem_no: req?.body.problem_no,
                question: req?.body.question,
                answer: req?.body.answer,
                answer_uploaded: req?.body.answer_uploaded,
                flag: req?.body.flag,
                source: req?.body.source,
            });
            let total_question = singleBook?.total_question + 1
            await Book.findOneAndUpdate({
                ISBN13: isbn
            },{
                total_question: total_question
            })
            res.status(200).json({
                status: res?.statusCode,
                message: "updated chapters question"
            });
        }
        
    } catch (error) {
        res.status(505).json({
            error: true,
            status: 505,
            message: error.message
        })
    }
}


const SaveQuizletChapters = async (req, res) => {
    try {
        
        let FinalData = req.body.quizlet;
        let filter = {book_isbn: req.body.book_isbn};
        let count = await QuizletChapter.count(filter) ;
        // res.send(count); return;
        if(count === 0){
            await QuizletChapter.insertMany(FinalData);
            await Book.findOneAndUpdate({ISBN13: req?.body?.book_isbn},{quizlet_imported: 1,bartleby_imported: 0})
            res.status(201).json({
                error: false,
                status: 201,
                message: 'chapter inserted'
            })
        }

    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error
        })
    }
}
const SaveQuizletSections = async (req, res) => {
    try {
        
        let FinalData = req.body.sections;
        let filter = {book_isbn: req.body.book_isbn, _id: req?.body?._id};
        let count = await QuizletChapter.count(filter) ;
        // res.send(count); return;
        if(count > 0){
            await QuizletChapter.findByIdAndUpdate(filter, {
                $push: {
                    sections: FinalData
                }
            });
            await QuizletChapter.findByIdAndUpdate(filter, {
                total_section: req?.body?.total_section,
                sec_uploaded: 1
            });
            res.status(201).json({
                error: false,
                status: 201,
                message: 'chapter inserted'
            })
        }

    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error
        })
    }
}


const quizletChapters = async (req, res) => {
    try {
        let data = await QuizletChapter.find({
            book_isbn: req?.params?.isbn
        });

        data.forEach( d => {
            d.type = 'quizlet'
        })
        if(data?.length === 0){
            const chapters = [];
            const map = new Map();
            const results = await Chapter.find({
                "book_isbn": `${req.params.isbn}`,
            },{
                _id: 1,
                chapter_no: 1,
                chapter_name: 1
            });
            results.forEach( item => {
                if(!map.has(item.chapter_no)){
                    map.set(item.chapter_no, true);
                    chapters.push({
                        _id: item.id,
                        chapter_no: item.chapter_no, 
                        chapter_name: item.chapter_name, 
                        type: 'old-book'
                    })
                }
            });
            data = chapters
         
        }
        res.status(201).json({
            error: false,
            status: 201,
            data: data,
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const quizletSection = async (req, res) => {
    try {
        
        let data = await QuizletChapter.find({
            book_isbn: req?.params?.isbn, 
            _id: req?.params?.ch_id, 
            sec_uploaded: 1
        },{sections: 1, total_section: 1});
        res.status(201).json({
            error: false,
            status: 201,
            data: data
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const oldbookQuestions = async (req, res) => {
    try {
        
        let data = await Chapter.find({
            book_isbn: req?.params?.isbn, 
            chapter_no: req?.params?.chapter_no,
            answer_uploaded: false 
        },{
            problem_no: 1,
            question: 1,
            _id: 1,
            answer_uploaded: 1
        });
        res.status(201).json({
            error: false,
            status: 201,
            data: data
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}

const deleteChapters = async (req, res) => {
    try {
        let filter = {book_isbn: req.body.isbn, chapter_no: req.body.chapter_no};
        let data = await Chapter.deleteMany(filter);
        await BartelbyChapter.updateMany(filter, {
            uploaded: 0,
            answer_uploaded: 0,
            total_question: 0,
            total_uploaded: 0
        })
        res.status(201).json({
            error: false,
            status: 201,
            message: "deleted"
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const deleteQuestions = async (req, res) => {
    try {
        let filter = {book_isbn: req.body.book_isbn};
        await Chapter.updateMany(filter,{question: ''});
        res.status(201).json({
            error: false,
            status: 201,
            message: "updated"
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}


const deleteAllChapters = async (req, res) => {
    try {
        // res.send(req.body.delete_salt);
        if(req?.body?.delete_salt === ''){
            res.status(401).json({
                error: true,
                status: res.statusCode,
                message: "salt not available"
            })  
        }else if(req?.body?.delete_salt !== 'server-delete'){
            res.status(401).json({
                error: true,
                status: 501,
                message: "salt mismatched"
            })    
        }else if(req?.body?.delete_salt === 'server-delete'){
            let filter = {book_isbn: req.body.book_isbn};
            await Chapter.deleteMany(filter);
            await BartelbyChapter.updateMany(filter, {
                uploaded: 0,
                answer_uploaded: 0,
                total_question: 0,
                total_uploaded: 0
            })
            res.status(201).json({
                error: false,
                status: 201,
                message: "deleted"
            })
        }
        
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}

const UpdateChapterName = async (req, res) => {
    try {
        if(req?.body?.update_salt === ''){
            res.status(401).json({
                error: true,
                status: res.statusCode,
                message: "salt not available"
            })  
        }else if(req?.body?.update_salt !== 'server-update'){
            res.status(401).json({
                error: true,
                status: 501,
                message: "salt mismatched"
            })    
        }else if(req?.body?.update_salt === 'server-update'){
            let filter = {
                book_isbn: req?.body?.book_isbn,
                chapter_no: req?.body?.chapter_no,
            };
            let update = {
                chapter_name: req?.body?.chapter_name
            }
            let count = await Chapter.find(filter).countDocuments();
            if(req?.body?.source === "QZ"){
                await QuizletChapter.findOneAndUpdate(filter, update);
            }
            else if(req?.body?.source === "BB"){
                await BartelbyChapter.findOneAndUpdate(filter, update);
            }
            
            if(count > 0){
                await Chapter.updateMany(filter, update);
            }
            res.status(201).json({
                error: false,
                status: 201,
                message: "Chapter Updated"
            })
        }
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
module.exports = {
    UpdateChapterName,
    oldbookQuestions,
    SaveQuizletAnswer,
    SaveQuizletSections,
    SaveQuizletChapters,
    quizletSection,
    quizletChapters,
    BartelbyProblems,
    BartelbyUpdateChaptersAnswer,
    BartelbyClearAllChapters,
    BartelbyDeleteAllChapters,
    BartelbyClearChapters,
    BartelbyChaptersChangeStatus,
    BartelbyQuestionAnswers,
    BartelbyUpdatesChapters,
    SaveBartlebyChapters,
    BartelbyChapters,
    BartelbyImportChapter,
    importChapter,
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
    addFields,
    deleteChapters,
    deleteQuestions,
    deleteAllChapters
}