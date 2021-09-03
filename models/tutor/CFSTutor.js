const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const md5 = require('md5');

const CFSTutorSchema = new mongoose.Schema({
    displayName: {
        type: String,
    },
    Name: {
        type: String,
    },
    Email: {
        type: String,
        unique: true,
    },
    tutor_type: {
        type: String,
        unique: true,
    },
    Password: {
        type: String,
        trim: true
    },
    img:{
        type: String
    },
    Contact:{
        type: String
    },
    Subject:{
        type: String
    },
    resume:{
        type: String
    },
    ResiAddress:{
        type: String
    },
    AboutMe:{
        type: String
    },
    Address:{
        type: String
    },
    State:{
        type: String
    },
    Country:{
        type: Boolean
    },
    Zipcode:{
        type: String,
        default: '0'
    },
    role: {
        type: String,
        default: 'cfs_tutor'
    },
    status: {
        type: Number,
    },
    type:{
        type: String
    }
},
{ timestamps: true });

CFSTutorSchema.pre('save', function(next) {
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

CFSTutorSchema.pre('findOneAndUpdate', async function(next) {
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

CFSTutorSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('CFSTutors', CFSTutorSchema);