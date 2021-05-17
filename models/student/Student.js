const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs');

const TransactionSchema = new mongoose.Schema({ 
    subscription_id: 'string', 
    payment_id: 'string', 
    SubscribeDate: {
        type: Date,
        default: Date.now
    }, 
    status: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    } 
});

const StudentSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    dob:{type: String},
    wallet: {type: String},
    Subscribe: 
        {
            type: Boolean,
            default: false 
        },
    SubscribeDate: {type: String},
    social_id: {type: String},
    password: {type: String,trim: true},
    dept: {type: String},
    typ: {type: String},
    college: {type: String},
    years: {type: String},
    img: {type: String},
    country_code: {type: String},
    Contact: {type: String},
    otp: {type: String},
    Address: {type: String},
    State: {type: String},
    Country: {type: String},
    Zipcode: {type: String},
    chkIsStudent: {type: String},
    is_created: {type: String},
    ip: {type: String},
    loginwith: {type: String},
    ios_token: {type: String},
    subs_recurring: {type: String},
    last_active_url: {type: String},
    transactions: {
        type: [TransactionSchema]
    },
    role: {
        type: String,
        default: "student"
    },
    newStudent: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
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