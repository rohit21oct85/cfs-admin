const Sub_Subject = require('../../models/admin/SubSubject.js');
const Subject = require('../../models/admin/Subject.js');


const SubSubjects = async(req, res) => {
    try {
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

const AllSubjects = async (req, res) => {
    try {
        const Subjects = await Subject.find({},{_id: 1, subject: 1});
        res.status(200).json({
            data: Subjects
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
module.exports = {
    AllSubjects,
    SubSubjects,
}