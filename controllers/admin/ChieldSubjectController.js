const ChieldSubject = require('../../models/admin/ChieldSubject.js');

const AllChieldSubject = async(req, res) => {
    try {
        const CSubject = await ChieldSubject.find({ 
            subject_id: req.params.subject_id, 
            sub_subject_id: req.params.sub_subject_id,
            status: req.params.status
        }, {chield_subject_id:1,chield_subject:1, status: 1, _id: 1, uuid: 1}).sort({
            chield_subject: 1
        });
        return res.status(200).json({
            data: CSubject
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const addFields = async (req, res) => {
    await ChieldSubject.updateMany({},
        {
            "total_question": 0,
            "total_page": 0,
            "page_uploaded": 0,
            "total_uploaded": 0,
            "status": false,
        });
        res.status(201).json({
            error: false,
            message: "field cleared"
        });
}

module.exports = {
    AllChieldSubject,
    addFields
}