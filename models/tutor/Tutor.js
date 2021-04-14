const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = mongoose.Schema({
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
    }
});
const masterSubjectSchema = mongoose.Schema({
    subject_id: {
        type: String
    },
    subject_name: {
        type: String
    }
});

const bankSchema = mongoose.Schema({
    paypal: {
        type: String
    },
    bank_name: {
        type: String
    },
    account_type: {
        type: String
    },
    account_holder: {
        type: String
    },
    account_number: {
        type: String
    },
    ifsc_code: {
        type: String
    },
    bank_country: {
        type: String
    }
});

const TutorSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
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
        type:{educationSchema}
    },
    
    master_subject: {
        type: {masterSubjectSchema}
    },
    
    bank_details: {
        type:{bankSchema}
    },
    role: {
        type: String,
        default: 'tutor'
    },
    status: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

TutorSchema.pre('save', function(next) {
    const tutor = this;
    if (!tutor.isModified || !tutor.isNew) {
        next();
    } else {
        bcrypt.hash(tutor.password, 10, function(err, hash) {
            if (err) {
                console.log('Error hashing password for tutor', tutor.fullname);
                next(err);
            } else {
                tutor.password = hash;
                next();
            }
        })
    }
});

TutorSchema.pre('findOneAndUpdate', async function(next) {
    try {
        if (this._update.password) {
            const hashed = await bcrypt.hash(this._update.password, 10)
            this._update.password = hashed;
        }
        next();
    } catch (err) {
        return next(err);
    }

});


module.exports = mongoose.model('Tutors', TutorSchema);