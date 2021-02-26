const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const RemoveDataSchema = new mongoose.Schema({
    module_id: {
        type: String,
        required: true,
    },
    module_name: {
        type: String,
        required: true,
    },
    module_method: {
        type: String,
        required: true
    },
    module_password: {
        type: String,
        required: true,
        trim: true
    },
    module_plain_password: {
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

RemoveDataSchema.pre('save', function(next) {
    const removeData = this;
    if(!removeData.isModified || !removeData.isNew){
        next();
    }else{
        bcrypt.hash(removeData.module_password, 10, function(err, hash){
            if(err) {
                console.log('Error hashing password for admin', removeData.module_name);
                next(err);
            }
            else{
                removeData.module_password = hash;
                next();
            }
        })
    }
});

RemoveDataSchema.pre('findOneAndUpdate', async function(next) {
    try {
        if (this._update.module_password) {
            const hashed = await bcrypt.hash(this._update.module_password, 10)
            this._update.module_password = hashed;
        }
        next();
    } catch (err) {
        return next(err);
    }
});

module.exports = mongoose.model('RemoveData', RemoveDataSchema);