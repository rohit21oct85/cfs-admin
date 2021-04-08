const Sub_Subject = require('../../models/admin/SubSubject.js');


const SubSubjects = async(req, res) => {
    try {
        // const total = await Book.countDocuments(Book.find({ sub_subject_name: req.params.sub_subject_name }, { __v: 0 })).collation( { locale: 'en', strength: 2 } );
        const SubSubjects = await Sub_Subject.find({ subject: req.params.subject_name }, { __v: 0 }).collation( { locale: 'en', strength: 2 });
        return res.status(200).json({
            data: SubSubjects
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

module.exports = {
    SubSubjects,
}