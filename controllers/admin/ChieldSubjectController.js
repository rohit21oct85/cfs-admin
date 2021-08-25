const ChieldSubject = require('../../models/admin/ChieldSubject.js');
const Question = require('../../models/admin/Question.js');

const AllChieldSubject = async(req, res) => {
    try {
        const CSubject = await ChieldSubject.find({ 
            subject_id: req.params.subject_id, 
            sub_subject_id: req.params.sub_subject_id,
            status: req.params.status
        }, {chield_subject_id:1,chield_subject:1, status: 1, _id: 1, uuid: 1});
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
const deleteChieldSbjects = async (req, res) => {
    try {
        // res.send(req.body.delete_salt);
        if(req?.body?.delete_salt === ''){
            res.status(401).json({
                error: true,
                status: res.statusCode,
                message: "salt not available"
            })  
        }else if(req?.body?.delete_salt !== 'server-delete'){
            res.status(401).json({
                error: true,
                status: 501,
                message: "salt mismatched"
            })    
        }else if(req?.body?.delete_salt === 'server-delete'){
            let filter = {chield_subject_id: req.body.chield_subject_id};
            await Question.deleteMany(filter);
            await ChieldSubject.updateMany(filter,
                {
                    "toal_question": 0,
                    "total_page": 0,
                    "page_uploaded": 0,
                    "total_uploaded": 0,
                    "status": false,
                });
            res.status(201).json({
                error: false,
                status: 201,
                message: "deleted ChieldSubject"
            })
        }
        
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
module.exports = {
    deleteChieldSbjects,
    AllChieldSubject,
    addFields
}