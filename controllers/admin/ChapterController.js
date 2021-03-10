const Chapter = require('../../models/admin/Chapter.js');

const uploadChapter = async(req, res) => {
    return res.send(req.body);
    const data = req.body;
    let FinalData = [];

    try {
        let results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data.subsubject))
            .on('end', () => {
                results.forEach(sub => {
                    FinalData.push({ status: 1, 'subject_id': data.subject_id, subject: data.subject, sub_subject: sub })
                })
                otherFunction(res, FinalData, function() {
                    console.log(req.file.path)
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