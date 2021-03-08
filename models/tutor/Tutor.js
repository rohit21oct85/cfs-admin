const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const TutorSchema = new mongoose.Schema({
    fullname: {
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
    role: {
        type: String,
        required: true,
        default: "tutor"
    },
    status: {
        type: Boolean,
        required: true,
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