const Chapter = require('../../models/admin/Chapter.js');
const csv = require('csv-parser')
const fs = require('fs')

const uploadChapter = async(req, res) => {
    // return res.send(req.body);
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
            .on('data', (data) => {results.push(data)
                // console.log(data)
            })
            .on('end', () => {
                results.forEach((sub, key) => {
                    if(sub['Chapter No'] !== ''){
                        chapters.push({'chapter_no':sub['Chapter No'], 'chapter_name':sub['Chapter Name'], 'sections':[]})
                    } 
                    if(sub['Section No'] !== ''){
                        if(sub['Chapter No'] !== '' && sub['Section No'] !== ''){
                            sections = [];
                        }
                        sections.push({'section_no':sub['Section No'], 'section_name':sub['Section Name'], 'exercises':[]})
                    }  
                    // if(sub['Excerise'] !== ''){
                    //     exercises.push({'exercise_name':sub.Excerise, 'problems':[]})
                    // }
                    // if(sub['problems'] !== ''){
                    //     problems.push({'problem_id':sub['Problem ID'], 'question':sub.Question})
                    // }
                    // console.log(key);
                    // if(chapters[key] !== undefined){
                    //     console.log(key);
                    //     chapters[key].sections = sections
                    // }
                    // if(chapters[key] !== undefined && chapters[key].sections[key] !== undefined){
                    //     chapters[key].sections[key].exercises = exercises
                    // }
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
     res.status(200).send(FinalData)
    // console.log(FinalData);
    // await Book.insertMany(FinalData).then(() => {
    //     res.status(200).send('Sub subject Inserted')
    //     callback()
    // }).catch(error => {
    //     res.status(409).json({
    //         message: "Error occured while Inserting Data",
    //         errors: error.message
    //     });
    // })
}

module.exports = {
    uploadChapter,
}