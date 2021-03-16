const SubSubject = require('../../models/admin/SubSubject.js');
const Subject = require('../../models/admin/Subject.js');

const getAllCategory = async(req, res) => {
    try {
        const SubSubjectResponse = await Subject.aggregate([
            {
            $lookup: {
                    from: "subsubjects",
                    localField: "subject",
                    foreignField: "subject",
                    as: "sub_subject"
                },
            },
        ])
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