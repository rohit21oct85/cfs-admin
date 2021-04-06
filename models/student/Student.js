const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
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
    school: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        default: "student"
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

StudentSchema.pre('save', function(next) {
    const student = this;
    if (!student.isModified || !student.isNew) {
        next();
    } else {
        bcrypt.hash(student.password, 10, function(err, hash) {
            if (err) {
                console.log('Error hashing password for student', student.fullname);
                next(err);
            } else {
                student.password = hash;
                next();
            }
        })
    }
});

StudentSchema.pre('findOneAndUpdate', async function(next) {
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

StudentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Student', StudentSchema);