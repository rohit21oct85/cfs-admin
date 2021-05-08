const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const md5 = require('md5');

const EducationSchema = new mongoose.Schema({ 
    class: {
        type: String
    },
    grade: {
        type: String
    },
    subject: {
        type: String
    },
    year: {
        type: String
    },
    docs: {
        type: String
    },
    college: {
        type: String
    }
});

const TutorSchema = new mongoose.Schema({
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    Contact: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        trim: true
    },
    house_name:{
        type: String,
    },
    street_name:{
        type: String,
    },
    city:{
        type: String,
    },
    zipcode:{
        type: String,
    },
    country:{
        type: String
    },
    education: {
        type: [EducationSchema]
    },
    master_subject: {
        type: String
    },
    master_subject_id: {
        type: Object
    },
    paypal: {
        type: String
    },
    bank_details: {
        type: String
    },
    avatar:{
        type: String
    },
    resume:{
        type: String
    },
    referal_code:{
        type: String
    },
    otp:{
        type: String
    },
    loginWith:{
        type: String
    },
    social_id:{
        type: String
    },
    is_first:{
        type: Boolean
    },
    approve:{
        type: String,
        default: '0'
    },
    role: {
        type: String,
        default: 'tutor'
    },
    status: {
        type: String,
        default: '0'
    },
    type:{
        type: String
    }
},
{ timestamps: true });

TutorSchema.pre('save', function(next) {
    const tutor = this;
    if (!tutor.isModified || !tutor.isNew) {
        next();
    } else {
        const hash = md5(tutor.password)
        tutor.password = hash;
        // tutor.password = tutor.password;
        next();
    }
});

TutorSchema.pre('findOneAndUpdate', async function(next) {
    try {
        if (this._update.password) {
            const hashed = md5(this._update.password)
            this._update.password = hashed;
        }
        next();
    } catch (err) {
        return next(err);
    }
});

TutorSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Tutors', TutorSchema);