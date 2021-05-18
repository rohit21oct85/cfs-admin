const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CountrySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    slug:{type: String},
    code2: {type: String},
    code3: {type: String},
    phonecode: {type: String},
    content: {type: String},
    mtitle: {type: String,required: true,trim: true},
    mkeyword: {type: String},
    mdecription: {type: String},
    status: {type: String}
});

CountrySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Country', CountrySchema);