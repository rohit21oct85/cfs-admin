const Assignment = require('../../models/admin/Assignment');

const saveAssignmentOne = async (req, res) => {
    try {
        const content = {question: req.body.question,subject: req.body.subject, sub_subject: req.body.sub_subject, subject_id: req.body.subject_id,sub_subject_id:req.body.sub_subject_id,user_id:req.body.user_Id,image:req.file ? req.file.filename : '',};
        const assign = await new Assignment(content).save()
        if(assign){
            return res.status(200).json({
                error: false,
                message: "Assignment inserted",
                assign
            });
        }
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const saveAssignmentTwo = async (req, res) => {
    try {
        // return res.send(req.body)
        const filter = {_id:req.body.id,user_id:req.body.user_Id}
        const content = {deadline_date: req.body.deadline_date,deadline_time: req.body.deadline_time, pages: req.body.pages, reference: req.body.reference};
        const assignment = await Assignment.findOneAndUpdate(filter, content);
        if(assignment){
            return res.status(200).json({
                error: false,
                message: "Assignment updated",
                assignment:assignment
            });
        }
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

module.exports = {
    saveAssignmentOne,
    saveAssignmentTwo,
}