const Question = require('../../models/admin/Question.js');
const ChieldSubject = require('../../models/admin/ChieldSubject.js');

const importData = async (req, res) => {
    try {
        
        // return res.send(req.body)
        const data = req?.body?.questions;
        await Question.insertMany(data);
        
        const pageCount = req?.body?.pageCount;
        const currentPage = req?.body?.currentPage;
        const perPage = req?.body?.perPage;
        const page = req?.body?.page;
        const totalQuestion = req?.body?.totalQuestion;
        const chield_subject_id = req?.body?.chield_subject_id;
        
        let filterData = {chield_subject_id: chield_subject_id};
        let total_uploaded = 0;

        if(pageCount == "1"){
            total_uploaded = data?.length
            await ChieldSubject.findOneAndUpdate(filterData,{
                "status": true,
                "toal_question": totalQuestion,
                "total_page": pageCount,
                "page_uploaded": page,
                "total_uploaded": total_uploaded
            });    
        }else if(pageCount > "1"){
            let chieldData = await ChieldSubject.findOne(filterData,{
                "toal_question": 1,
                "total_page": 1,
                "page_uploaded": 1,
                "total_uploaded": 1
            });

            total_updated = +chieldData?.total_uploaded + +data?.length;
            // return res.send(total_updated);
            let status;
            if(+page === +pageCount){
                status = true
            }else{
                status = false
            }
            await ChieldSubject.findOneAndUpdate(filterData,{
                "toal_question": totalQuestion,
                "status": true,
                "total_page": pageCount,
                "page_uploaded": page,
                "total_uploaded": total_updated
            });
        }

        return res.status(201).json({
            error: false,
            status: 201,
            message: "Question Added successfully",
            totalQuestion: totalQuestion,
            uploadedQuestion: total_updated
        });

    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}

const chieldQuestion = async (req, res) => {
    try {
        const QuestionData = await Question.find({
            chield_subject_id: req.params.chield_subject_id
        });
        res.status(201).json({
            error: false,
            status: 201,
            data:QuestionData
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            status: 501,
            message: error.message
        })
    }
}
const deleteChieldQuestion = async (req, res) => {
    try {
        await Question.deleteMany({ "chield_subject_id": req.params.chield_subject_id}).then(response => {
            return res.status(201).json({
                message: "subject, deleted successfully"
            })
        });
    } catch (error) {
        res.send({
            error: true,
            code: 501,
            message: error.message
        })
    }
}

module.exports = {
    importData,
    chieldQuestion,
    deleteChieldQuestion
}