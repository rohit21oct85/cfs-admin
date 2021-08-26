const Questions = require('../../models/admin/Question');

const searchQuestion = async (req, res) => {
    try {
        const search = req.body.search; // only recieve 100 chars in search
        const limit = parseInt(req.body.limit);
        // working with special charcters
        // let searchString = regexEscape(search)
        const questions = await Questions.find({ 
            $or:
            // [{book_isbn: { $regex: search}},{book_name:{ $regex:search }},{question:{$regex:search}}]
            [{question:{$regex:search}}]
        },{
            _id:0,
            price :1,
            shortanswer:1,
            completeanswer:1,
            subject:1,
            subject_id:1,
            sub_subject:1,
            sub_subject_id:1,
            chield_subject_id:1,
            question:1,
        }).limit(limit);
        res.status(200).json({
            questions
        });
    } catch (error) {
        res.status(409).json({
            error: true,
            message: "Error occured",
            errors: error.message
        });
    }
}

module.exports = {
    searchQuestion,
}