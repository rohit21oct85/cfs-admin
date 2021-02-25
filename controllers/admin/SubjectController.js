const subject = require('../../models/admin/Subject.js');

const getAllSubject = async (req, res) => {
    try{
        const Subjects = await subject.find({},{__v: 0});
        return res.status(200).json({ 
            total: Subjects.length,
            data: Subjects 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
    
}
const createSubject = async (req, res) => {
    const data = req.body;
    const subject_name = data.subject;
    const SubjectData = subject_name.split(", ");
    let FinalData = [];
    
    try {
        await SubjectData.forEach( sub => {
            FinalData.push({subject: sub})
        })

        await subject.insertMany(FinalData).then(
            res.status(201).json({
                messgae: 'subject Inserted'
            })
        ).catch(error => {
                res.status(409).json({
                    message: "Error occured while Inserting Data",
                    errors: error.message
                });
        })
    }
    catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
    
}
const updateSubject = async (req, res) =>{
    try {
        await subject.findByIdAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "subject, Updated successfully"
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
const deleteSubject = async (req, res) =>{
    const id = req.params.id;
    try {
        await subject.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "subject, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};
const viewSubject = async (req, res) => {
    try{
        const Subject = await subject.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: Subject
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
    
}


module.exports = {
    getAllSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    viewSubject
}