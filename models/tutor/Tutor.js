const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const md5 = require('md5');

const educationSchema = new mongoose.Schema({
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
const DateSchema = {
    type: Date,
    format: 'YY-mm-dd'
}
const TutorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    house_name:{
        type: String,
        required: true,
    },
    street_name:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    zipcode:{
        type: String,
        required: true,
    },
    country:{
        type: String
    },
    education: {
        type: [educationSchema]
    },
    master_subject_id: {
        type: String
    },
    master_subject: {
        type: String
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
        type: String
    },
    role: {
        type: String,
        default: 'tutor'
    },
    status: {
        type: String
    },
    type:{
        type: String
    },
    created_at: {
        type: DateSchema
    }
});

TutorSchema.pre('save', function(next) {
    const tutor = this;
    if (!tutor.isModified || !tutor.isNew) {
        next();
    } else {
        const hash = md5(tutor.password)
        // tutor.password = hash;
        tutor.password = tutor.password;
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