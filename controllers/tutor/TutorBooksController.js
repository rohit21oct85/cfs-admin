const Book = require('../../models/admin/Book')
const Chapter = require('../../models/admin/Chapter')

const openBook = async (req, res) => {
    try {
        const filter = {sub_subject_id:req.body.subject_id, published: true}
        const project = {_id:1, BookName:1,ISBN13: 1};
        const books = await Book.find(filter,project);
        return res.send(books);
        
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error.message
        })
    }
    
}

const getAnswered = async (req, res) => {
    res.status(201).json(await Chapter.count({
        book_isbn: req.body.book_isbn,
        chapter_no: req.body.chapter_no,
        answered: true,
        assigned: false
    }));
}
const chapterQuestion = async (req, res) => {
    try {
        const filter ={"book_isbn": req.body.book_isbn};
        const chapters = [];
        const map = new Map();
        
        const results = await Chapter.find(filter,{
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
        filter.assigned = false;
        if(req.body.chapter_no === "0"){
            filter.chapter_no = results[0].chapter_no;
            const questions = await Chapter.find(filter, {problem_no:1,question:1,_id:1, chapter_no:1})
            res.status(200).json({
                chapters,questions
            });
        }else{
            filter.chapter_no = req.body.chapter_no;
            const questions = await Chapter.find(filter, {problem_no:1,question:1,_id:1, chapter_no:1})
            res.status(200).json({
                questions
            });
        }
        
        
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}
const updateDB = async () => {
    await Chapter.find({}).updateMany({
        assigned: false, 
        assigned_to: '',
        flag: '',
        assigned_at: null,
        answered: false, 
        answered_at: null
    });
}
const startAnswering = async (req, res) => {
    // res.send(req.body);
    try {
        const filter = {_id: req.body.question_id};
        const data = {assigned: true, assigned_to: req.body.user_Id, flag: 'assigned', assigned_at: Date.now()}
        // updateDB();
        await Chapter.findOneAndUpdate(filter, {$set: data});
        res.send({error: false, message: 'answring started'});
    } catch (error) {
        res.send({error: true, message: error.message});
    }
}
const finishAnswer = async (req, res) => {
    
    // res.send(req.body);

    try {
        const filter = {_id: req.body.question_id};
        const type = req.body.answer_type;
        const data = {assigned_to: req.body.user_Id, flag: 'assigned'}
        if(type == 'skip'){
            data.assigned = false;
            data.flag = req.body.reason;
        }else{
            data.flag = 'answered';
            data.answered_at = Date.now()
            data.assigned = true
            data.answered = true
            data.temp_answer = req.body.temp_answer;
        }
        await Chapter.findOneAndUpdate(filter, {$set: data});
        res.send({error: false, message: 'answring finished'});

    } catch (error) {
        res.send({error: true, message: error.message});
    }
}


module.exports = {
    openBook,
    chapterQuestion,
    startAnswering,
    finishAnswer,
    getAnswered
}