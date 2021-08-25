const Admin = require('../../models/admin/Admin.js');
const Student = require('../../models/student/Student.js');
const Tutor = require('../../models/tutor/Tutor.js');
const Book = require('../../models/admin/Book.js');
const Chapter = require('../../models/admin/Chapter.js');
const Question = require('../../models/admin/Question.js');

const CreateAdmin = async (req, res) => {
    const body = req.body;
    
    try {
    
        const newAdmin = new Admin(body);
        await newAdmin.save();
        const AllAdmins = await Admin.find({},{__v: 0});
        return res.status(200).json({ 
            message: "Admin created sucessfully",
            admins: AllAdmins
        });
    
        
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateAdmin = async (req, res) =>{
    try {
        await Admin.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "admin, Updated successfully"
                    })
                })
                .catch(error => {
                    return res.status(500).json({
                        message: "Error Found",
                        errors: error.message
                    })
                });

    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}
const ViewAdmin = async (req, res) => {
    try{
        const AdminData = await Admin.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: AdminData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllAdmin = async (req, res) => {
    try{
        const AllAdmins = await Admin.find({},{__v: 0});
        return res.status(200).json({ 
            total: AllAdmins.length,
            data: AllAdmins 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteAdmin = async (req, res) =>{
    const id = req.params.id;
    try {
        await Admin.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Admin, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};
const DashboardStatics = async (req, res) => {
    try {
        let students = await Student.estimatedDocumentCount({});
        let tutors = await Tutor.estimatedDocumentCount({});
        let books = await Book.estimatedDocumentCount({});
        let chapters = await Chapter.estimatedDocumentCount({});
        let qnas = await Question.find({shortanswer: ""}).countDocuments();

        return res.status(res.statusCode).json({
            status: res.statusCode,
            data: {
                total_student: students,
                total_tutor: tutors,
                total_books: books,
                total_chapters: chapters,
                total_qna: qnas
            }
        })
        
    } catch (error) {
        res.status(res.statusCode).json({
            status: res.statusCode,
            message: error.message
        })
    }
}
module.exports = {
    DashboardStatics,
    CreateAdmin,
    UpdateAdmin,
    ViewAdmin,
    ViewAllAdmin,
    DeleteAdmin,
}