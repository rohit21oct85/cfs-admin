const Chapter = require('../../models/admin/Chapter.js');
const csv = require('csv-parser')
const fs = require('fs')
const checkValueIndex = (results, checkvalue) => {
    return results.findIndex( data => data.chapter_no === checkvalue);
}

const GetChapterQuestions = async (req, res) => {
    try{
        const results = await Chapter.find({
            "book_isbn": `${req.params.isbn}`,
        },{
            _id: 0,
            book_isbn: 1,
            chapter_no: 1,
            chapter_name: 1,
        });
        const chapters = results.filter( item => item.chapter_no === 1)
        const sections = results.filter(item => item.chapter_no === 1);

       

        return res.status(200).json({
            "book_isbn": results[0].book_isbn,
            "chapters": chapters,
            "sections": sections,
            
        });
    }   catch(e) {
        return res.status(500).json({
            "errors": true,
            "message": "Error found while fatching data"
        })
    }
    
}
const UploadChapters = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        let chapters = [];
        let chapter_index;
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach( (chapter, index) => {
                    if(chapter.chapter_no !== ''){
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
        res.status(200).send('Chapters Added Inserted')
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
}
module.exports = {
    UploadChapters,
    GetChapterQuestions
}