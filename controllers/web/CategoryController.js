const SubSubject = require('../../models/admin/SubSubject.js');

const getAllCategory = async(req, res) => {
    try {
        const SubSubjectResponse = await SubSubject.find({ status: true }, { __v: 0 }).limit(10);
        return res.status(200).json({
            data: SubSubjectResponse
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

module.exports = {
    getAllCategory,
}