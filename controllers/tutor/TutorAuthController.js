const Tutor = require('../../models/tutor/Tutor.js');
const SubSubject = require('../../models/admin/SubSubject.js');
const Subject = require('../../models/admin/Subject.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const md5 = require('md5');
var mongoose = require("mongoose");

let refreshTokens = [];

const Register = async(req, res) => {
    const body = req.body;
    // return res.send(body);
    try {
        let tutor = await Tutor.countDocuments(Tutor.findOne({ email: body.email }));
        if (tutor) {
            return res.status(409).send({
                message: 'User with the same email already registered'
            });
        }
        const newTutor = new Tutor(body);
        await newTutor.save();
        return res.status(200).json({
            message: "Registered Sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message: error.message
        })
    }
}


const comparePassword = async (password, dbpwd) => {
    if(md5(password) === dbpwd){
        return true
    }else{
        return false
    }
}
const Login = async(req, res) => {
    try {
        let tutor = await Tutor.findOne({ email: req.body.email });
        if (!tutor) return res.status(401).send({message: 'Invalid email or password'});

        const validPassword = await comparePassword(req.body.password, tutor.password);

        if (!validPassword) return res.status(401).send({message:"Invalid email or password"});

        const accessToken = generateAccessToken(tutor);
        const refreshToken = generateRefreshToken(tutor);
        refreshTokens.push(refreshToken);

        return res.status(200).json({
            accessToken,
            refreshToken,
            tutor
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const generateAccessToken = (user) => {
    const accessTokenSecret = 'CFSAT2021';
    return jwt.sign({
        id: user._id,
        role: user.role
    }, accessTokenSecret, { expiresIn: '30d' })
}

const generateRefreshToken = (user) => {
    const refreshTokenSecret = 'CFSRT2021';
    return jwt.sign({
        id: user._id,
        role: user.role
    }, refreshTokenSecret);
}

const ForgotPassword = async(req, res) => {
    try {
        const email = req.body.email;
        const data = await Tutor.findOne({ email: email });
        if (data) {
            return res.status(201).json(data)
        } else {
            return res.status(402).json({ message: "Email does not exist in our records" })
        }
    } catch (error) {
        return res.status(502).json({ message: "Somethign went wrong!" })
    }
}

const Logout = async(req, res) => {
    const accessTokenSecret = 'CFSAT2021';
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const accessToken = req.headers.authorization.split(' ')[1];
        const decode = await jwt.verify(accessToken, accessTokenSecret);
        const UserData = { id: decode.id, role: decode.role };
        let newAccessToken = await jwt.sign(UserData, 'sasdasd', { expiresIn: '0s' });
        return res.status(200).json({
            message: "successfully logged out",
            accessToken: newAccessToken
        });
    }
}

const RefreshToken = async(req, res) => {
    const refreshTokenSecret = 'CFSRT2021';
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.status(401).json({ message: 'Invalid refresh token' });
    if (!refreshTokens.includes(refreshToken)) return res.status(401).json({ message: 'Invalid refresh token' });
    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
        if (err) return res.status(err).json({ message: "Error found" });
        const accessToken = generateAccessToken({ email: user.email, role: user.role });
        return res.status(200).json({
            accessToken
        });
    })
}

const ChangePassword = async (req, res) => {
    // return res.send(req.body);
    try {
        const old_password = req.body.old_password;
        const new_password = req.body.new_password;
        const filter = { _id: req.body.user_Id, role: req.body.user_role };
        let tutor = await Tutor.findOne(filter, { __v: 0 });
        if (!tutor) return res.status(401).send({message: 'Invalid email or password'});
        const validPassword = await bcrypt.compare(req.body.old_password, tutor.password);
        if (!validPassword) return res.status(401).send({message:"Invalid password"});
        const update = await Tutor.findOneAndUpdate(filter, {password: new_password});
        if(update){
            res.send({error: false, message: "password changed"});
        }   
    } catch (error) {
        res.status(501).json({
            error: true,
            message: error.message
        })
    }
}

const saveProfileInfo = async(req,res) => {
        const filter = { email: req.body.email };
        let tutor = await Tutor.findOneAndUpdate(filter,  
            { $set: 
                {   fname: req.body.fname,
                    lname:req.body.lname,
                    house_name:req.body.hno,
                    street_name:req.body.street,
                    city:req.body.city,
                    zipcode:req.body.zip,
                    country:req.body.country,
                }
            });
        if (!tutor) return res.status(500).send({message: 'Something Went Wrong'});
        else return res.status(200).send({message: 'Data updated Successfully'});
}

const saveEducation = async(req,res) => {
    // return res.send(req.body)
        const filter = { email: req.body.email };
        let tutor = await Tutor.updateOne(filter,
            { $addToSet:
                {   
                    "education" : [{"class": req.body.degree,"grade":req.body.grade,"year":req.body.years,"subject":req.body.subject,"college":req.body.college,"docs":req.file.filename,}]
                }
            });
        if (!tutor) return res.status(500).send({message: 'Something Went Wrong'});
        else return res.status(200).send({message: 'Data updated Successfully'});
}

const masteredSubject = async(req,res) => {
    const filename = req.file ? req.file.filename : '';
    const filter = { email: req.body.email };
    let tutor = await Tutor.findOneAndUpdate(filter,  
        { $set:
            {   master_subject: req.body.sub_subject,
                // master_sub_subject:req.body.sub_subject,
                master_subject_id:req.body.sub_subject_id,
                resume: filename,
            }
        });
    if (!tutor) return res.status(500).send({message: 'Something Went Wrong'});
    else return res.status(200).send({message: 'Data updated Successfully'})
}

const saveBankDetails = async(req,res) => {
    try{
        let OP={};
        const data = req.body;
        const filter = { email: req.body.email };
        delete data['email'];
        const d = JSON.stringify(data);
        if(req.body.paypal){
            OP = {
                paypal: req.body.paypal
            }
        }else{
            OP = {
                bank_details: d
            }
        }
        let tutor = await Tutor.findOneAndUpdate(filter,  
            { $set:
                OP
            });
        if (!tutor) return res.status(500).send({message: 'Something Went Wrong'});
        else return res.status(200).send({message: 'Data updated Successfully'})
    }catch(e){
        return res.status(409).json({
            error: true,
            message: e.message
        })
    }
}

const getTutorDetails = async(req,res) => {
    // return res.send(req.body.email);
    const filter = { email: req.body.email };
    try {
        const SingleTutor = await Tutor.findOne(filter, { __v: 0 });
        const bank_details = SingleTutor.bank_details ? JSON.parse(SingleTutor.bank_details) : null;
        SingleTutor.bank_details = bank_details
        return res.status(200).json({
            data: SingleTutor,
            bank_details : bank_details
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }

}

const getAllCategory = async(req, res) => {
    try {
        const SubSubjectResponse = await Subject.aggregate([
            {
                "$project": {
                    "_id": {
                        "$toString": "$_id"
                    },
                    "sub_subject" : 1,
                    "subject" : 1,
                }
            },
            {
            $lookup: {
                    from: "subsubjects",
                    localField: "_id",
                    foreignField: "subject_id",
                    as: "sub_subject"
                },
            },
        ])
        return res.status(200).json({
            data: SubSubjectResponse
        });

    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const deleteEducation = async (req, res) => {
    try {
        const filter = { email: req.body.email };
        const data = await Tutor.findOneAndUpdate(filter, {$pull : { "education" : {"_id": req.body.id } } } );
        return res.status(200).send({message: "education deleted successfully"});
    } catch (error) {
        res.send({error: true, message: error.message});
        
    }
}

module.exports = {
    Register,
    Login,
    ForgotPassword,
    RefreshToken,
    Logout,
    ChangePassword,
    saveProfileInfo,
    saveEducation,
    masteredSubject,
    saveBankDetails,
    getTutorDetails,
    getAllCategory,
    deleteEducation
}