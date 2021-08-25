const Assignment = require('../../models/admin/Assignment');
const Tutor = require('../../models/tutor/Tutor');

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

const saveAssignmentLocal = async (req, res) => {
    try {
        // return res.send(req.body)
        const tutor = await Tutor.aggregate([
            { $sample: { size: 1 } }
        ]);
        const content = {   question: req.body.question,subject: req.body.subject, 
                            sub_subject: req.body.sub_subject, subject_id: req.body.subject_id,
                            sub_subject_id:req.body.sub_subject_id,user_id:req.body.user_Id,
                            image:req.file ? req.file.filename : '',deadline_date: req.body.deadline_date,
                            deadline_time: req.body.deadline_time,pages: req.body.pages, 
                            reference: req.body.reference,
                            tutor_id: tutor._id, tutor_name: tutor.fname + tutor.lname
                        };
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
        const tutor = await Tutor.aggregate([
            { $sample: { size: 1 } }
        ]);
        console.log(tutor[0])
        const filter = {_id:req.body.id,user_id:req.body.user_Id}
        const content = {   deadline_date: req.body.deadline_date,deadline_time: req.body.deadline_time, 
                            pages: req.body.pages, reference: req.body.reference,amount:req.body.amount,
                            tutor_id: tutor[0]._id, tutor_name: tutor[0].fname+" "+tutor[0].lname
                        };
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

const getAssignmentInfo = async (req, res) => {
    try {
        const filter = {_id:req.body.id,user_id:req.body.user_Id}
        const assignment = await Assignment.findOne(filter);
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

const getAssignmentAll = async (req, res) => {
    try {
        // return res.send(req.body.user_Id.user_Id)
        const filter = { user_id: req.body.user_Id.user_Id }
        const assignment = await Assignment.find(filter).sort({created_at: -1});
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
    saveAssignmentLocal,
    getAssignmentInfo,
    getAssignmentAll,
}