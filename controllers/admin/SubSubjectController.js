const SubSubject = require('../../models/admin/SubSubject.js');
const csv = require('csv-parser')
const fs = require('fs')

const AllSubSubject = async(req, res) => {
    try {
        const Subjects = await SubSubject.find({ subject_id: req.params.subject_id }, { __v: 0 });
        return res.status(200).json({
            total: Subjects.length,
            data: Subjects
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }

}

const createSubSubject = async(req, res) => {
    const data = req.body;
    const sub_subject = data.sub_subject;
    const SubSubjectData = sub_subject.split(",");
    let FinalData = [];

    try {
        await SubSubjectData.forEach(sub => {
            FinalData.push({ status: 1, 'subject_id': data.subject_id, subject: data.subject, sub_subject: sub })
        })

        await SubSubject.insertMany(FinalData).then(
            res.status(201).json({
                messgae: 'Sub subject Inserted'
            })
        ).catch(error => {
            res.status(409).json({
                message: "Error occured while Inserting Data",
                errors: error.message
            });
        })

    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }

}

const uploadSubSubject = async(req, res) => {
    // return res.send(req.file);
    const data = req.body;
    let FinalData = [];

    try {
        let results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data.subsubject))
            .on('end', () => {
                results.forEach(sub => {
                    FinalData.push({ status: 1, 'subject_id': data.subject_id, subject: data.subject, sub_subject: sub })
                })
                otherFunction(res, FinalData, function() {
                    console.log(req.file.path)
                    fs.unlinkSync(req.file.path)
                })
            });
    } catch (error) {
        return res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const otherFunction = async(res, FinalData, callback) => {
    await SubSubject.insertMany(FinalData).then(() => {
        res.status(200).send('Sub subject Inserted')
        callback()
    }).catch(error => {
        res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
}

const updateSubSubject = async(req, res) => {
    try {
        await SubSubject.findByIdAndUpdate({ _id: req.params.id }, req.body)
            .then(response => {
                return res.status(201).json({
                    message: "SubSubject, Updated"
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

const getAllSubSubject = async(req, res) => {
    try {
        const Subjects = await SubSubject.find({ status: true }, { __v: 0 });
        return res.status(200).json({
            total: Subjects.length,
            data: Subjects
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }

}

const deleteSubSubject = async(req, res) => {
    const id = req.params.id;
    try {
        await SubSubject.deleteOne({ _id: id }).then(response => {
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

const viewSubSubject = async(req, res) => {
    try {
        const Subject = await SubSubject.findOne({ _id: req.params.id }, { __v: 0 });
        return res.status(200).json({
            data: Subject
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }

}


module.exports = {
    AllSubSubject,
    getAllSubSubject,
    createSubSubject,
    uploadSubSubject,
    updateSubSubject,
    deleteSubSubject,
    viewSubSubject
}