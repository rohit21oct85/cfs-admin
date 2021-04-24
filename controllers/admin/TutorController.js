const Tutor = require('../../models/tutor/Tutor.js');
const Chapter = require('../../models/admin/Chapter.js');
const csv = require('csv-parser')
const fs = require('fs')

const getAllTutor = async (req, res) => {
    try {
        let pageno = parseInt(req.params.pageno);
        let limit = parseInt(req.params.limit);
        const myCustomLabels = {
            totalDocs: 'itemCount',
            docs: 'itemsList',
            limit: 'perPage',
            page: 'currentPage',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'pageCount',
            pagingCounter: 'slNo',
            meta: 'paginator',
            };
        const options = {
            page: pageno,
            limit: limit,
            customLabels: myCustomLabels,
            collation: {
                locale: 'en',
            },
        };
        let query;
        let status = req.params.status;
        let master_subject = req.params.master_subject;
        let type = req.params.type;
        if(status === 'all' && master_subject === 'all' && type === 'all'){
            query = {} 
        }
        else if(status !== 'all' && master_subject !== 'all' && type !== 'all'){
            query = {status: `${req.params.status}`, master_subject: req.params.master_subject,type: req.params.type} 
        }
        else if(status === 'all' && master_subject === 'all' && type !== 'all'){
            query = {type: req.params.type} 
        }
        else if(status === 'all' && master_subject !== 'all' && type === 'all'){
            query = {master_subject: req.params.master_subject} 
        }
        else if(status === 'all' && master_subject !== 'all' && type !== 'all'){
            query = {master_subject: req.params.master_subject,type: req.params.type} 
        }
        
        else if(status !== 'all' && master_subject === 'all' && type === 'all'){
            query = {status: `${req.params.status}`} 
        }

        else if(status !== 'all' && master_subject === 'all' && type !== 'all'){
            query = {status: `${req.params.status}`,type: req.params.type} 
        }


        // return res.send(query);

        await Tutor.paginate(query,options).then(result => {
            return res.status(200).json({
                data: result.itemsList,
                itemCount: result.paginator.itemCount,
                perPage: result.paginator.perPage,
                currentPage: result.paginator.currentPage,
                pageCount: result.paginator.pageCount,
                next: result.paginator.next,
                prev: result.paginator.prev,
                slNo: result.paginator.slNo,
                hasNextPage: result.paginator.hasNextPage,
                hasPrevPage: result.paginator.hasPrevPage
            });
        });
    
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const updateStatus = async (req, res) => {
    try {
        
        const filter = {_id: req.body.tutor_id};
        let status = '0';
        if(req.body.status === true){
            status = 1;
        }
        await Tutor.findOneAndUpdate(filter,{status: status});
        res.status(201).json({
            error: false,
            message: "Tutor Activated successfully"
        })
        

    } catch (error) {
        res.status(501).json({
            error: true,
            message: error.message
        })
    }
}
const tutorDetails = async (req, res) => {
    try {
        // return res.send(req.body)
        const tutor = await Tutor.findOne({_id: req.params.tutor_id});
        const approved_qc = await Chapter.find({"assigned_to": req.params.tutor_id,flag: "approved"});
        const reworked_qc = await Chapter.find({"assigned_to": req.params.tutor_id,flag:"reworked"});
        const pending_qc = await Chapter.find({"assigned_to": req.params.tutor_id,flag: "answered"});

        res.status(201).json({
            error: false,
            data: tutor,
            statics: {
                "total_pending_qc": pending_qc,
                "total_solved": approved_qc,
                "total_reworked": reworked_qc,
            }
        })
    } catch (error) {
        res.status(501).json({
            error: true,
            message: error.message
        })
    }
}

const uploadTutorCSV = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        let education = []
        fs.createReadStream(req.file.path,{encoding: 'binary'})
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach( (data, index) => {
                    
                    FinalData.push({ 
                        fname: data.fname, 
                        lname: data.lname,
                        email: data.email,
                        password: data.password,
                        house_name: data.house_name,
                        street_name: data.street_name,
                        city: data.city,
                        zipcode: data.zipcode,
                        country: data.country,
                        education: [{
                            class: results[index].class,
                            grade: results[index].grade,
                            subject: results[index].subject,
                            year: results[index].year,
                            docs: results[index].docs,
                            college: results[index].college,
                        }],
                        master_subject_id: data.master_subject_id,
                        master_subject: data.master_subject,
                        paypal: data.paypal,
                        bank_details: data.bank_details,
                        avtar: data.avtar,
                        resume: data.resume,
                        referal_code: data.referal_code,
                        otp: data.otp,
                        loginWith: data.loginWith,
                        social_id: data.social_id,
                        is_first: data.is_first,
                        approve: data.approve,
                        role: data.role,
                        status: data.status,
                    })
                })

                UpdateotherFunction(res, FinalData, function() {
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


const UpdateotherFunction = async(res, FinalData, callback) => {
    try{
        // return res.send(FinalData);
        await Tutor.insertMany(FinalData);
        return res.status(201).json({
            error: false,
            message: "Review Uploaded successfully"
        })

        callback();

    }catch(err){
        return res.status(409).json({
            error: true,
            message: err.message
        })
    }
}

const addFields = async (req, res) => {

    await Tutor.updateMany({},
    {
        "type": "freelance"
    });
    res.status(201).json({
        error: false,
        message: "field cleared"
    });
}
module.exports = {
    getAllTutor,
    updateStatus,
    tutorDetails,
    uploadTutorCSV,
    addFields
}