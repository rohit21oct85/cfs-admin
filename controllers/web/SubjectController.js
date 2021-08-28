const Sub_Subject = require('../../models/admin/SubSubject.js');
const Subject = require('../../models/admin/Subject.js');
const ChildSubjects = require('../../models/admin/ChieldSubject.js');
const Questions = require('../../models/admin/Question');


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

const GetChildSubjects = async (req, res) => {
    try {
        const childSubjects = await ChildSubjects.find({sub_subject:req.params.sub_subject_name});
        res.status(200).json({
            data: childSubjects
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const GetQuestionAndAnswers = async (req, res) => {
    try {
        const child = req.params.child_subject.replace(/-/g,' ');
        const childSubjects = await ChildSubjects.findOne({ "$or": [
            { "chield_subject": { "$regex": `^${req.params.child_subject}$`,'$options' : 'i'} }, 
            { "chield_subject": { "$regex": `^${child}$`,'$options' : 'i'}}
        ]});
        const child_subject_id = childSubjects.chield_subject_id
        const questions = await Questions.find({chield_subject_id:child_subject_id}).skip(req.body.pageno * req.body.limit).limit(parseInt(req.body.limit))
        const total = await Questions.countDocuments(Questions.find({ chield_subject_id: child_subject_id }));
        res.status(200).json({
            data: questions,
            total:total
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const GetAnswer = async (req, res) => {
    try {
        const questions = await Questions.findOne({old_qid:req.params.old_id}).lean()
        const childSubject =  await ChildSubjects.findOne({chield_subject_id:questions.chield_subject_id})
        questions.cheild_subject = childSubject.chield_subject;
        res.status(200).json({
            data: questions,
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
    GetChildSubjects,
    GetQuestionAndAnswers,
    GetAnswer
}