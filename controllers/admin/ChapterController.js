const Chapter = require('../../models/admin/Chapter.js');
const csv = require('csv-parser')
const fs = require('fs')

const UploadChapters = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        let chapters = [];
        let sections = [];
        let exercises = [];
        let problems = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(chapter => {
                    FinalData.push({ 
                        book_id: data.book_id, 
                        book_name: data.book_name, 
                        book_isbn: data.book_isbn, 
                        chapter_no: chapter.chapter_no, 
                        chapter_name: chapter.chapter_name, 
                    })
                })
                chapters.forEach((index, key)=>{
                    chapters[key].sections = sections;
                })
                // console.log(chapters);
                // console.log(sections);
                // console.log(exercises);
                // console.log(problems)
                chapters.book_name = data.book_name,
                chapters.book_id = data.book_id, 
                chapters.book_isbn =data.book_isbn
                // console.log(chapters)
                // return chapters;

                otherFunction(res, chapters, function() {
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
    UploadChapters
}