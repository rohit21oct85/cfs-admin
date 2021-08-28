const Admin = require('../../models/admin/Admin.js');
const Student = require('../../models/student/Student.js');
const Tutor = require('../../models/tutor/Tutor.js');
const Book = require('../../models/admin/Book.js');
const Chapter = require('../../models/admin/Chapter.js');
const Question = require('../../models/admin/Question.js');
const TextBook = require('../../models/admin/TextBook.js');
const ChieldSubject = require('../../models/admin/ChieldSubject.js');

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
        let book_request = await TextBook.find({inStock: false}).countDocuments();

        return res.status(res.statusCode).json({
            status: res.statusCode,
            data: {
                total_student: students,
                total_tutor: tutors,
                total_books: books,
                total_chapters: chapters,
                total_qna: qnas,
                total_book_request: book_request,
            }
        })
        
    } catch (error) {
        res.status(res.statusCode).json({
            status: res.statusCode,
            message: error.message
        })
    }
}
const DataReports = async (req, res) => {
    try {
        let reports;
        let status = req?.params?.status
        let subject_id = req?.params?.subject_id
        let sub_subject_id = req?.params?.sub_subject_id
        let filter;
        // res.status(res.statusCode).json(filter); return;
        if(status === 'text-book-solutions'){
            filter = {
                subject_id: subject_id, 
                sub_subject_id: sub_subject_id,
                total_question: {$gt: 0}
            }
            reports = await Book.find(filter, {
                ISBN13: 1,
                Edition: 1,
                BookName: 1,
                published: 1,
                total_question: 1
            });
        }else if(status === 'question-and-answer'){
            filter = {
                subject_id: subject_id, 
                sub_subject_id: sub_subject_id,
                toal_question: {$gt: 0}
            }
            reports = await ChieldSubject.find(filter,{
                chield_subject: 1,
                chield_subject_id: 1,
                toal_question:1,
                page_uploaded:1,
                total_uploaded:1,
                total_page:1
            }).sort({
                chield_subject_id: 1
            });
        }
        return res.status(res.statusCode).json({
            status: res.statusCode,
            data: reports
        })
        
    } catch (error) {
        res.status(res.statusCode).json({
            status: res.statusCode,
            message: error.message
        })
    }
}

module.exports = {
    DataReports,
    DashboardStatics,
    CreateAdmin,
    UpdateAdmin,
    ViewAdmin,
    ViewAllAdmin,
    DeleteAdmin,
}