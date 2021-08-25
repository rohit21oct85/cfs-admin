const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({ 
    order_id: 'string', 
    payment_id: 'string', 
    type: 'string', 
    signature: 'string', 
    OrderDate: {
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

const AssignmentSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true,
    },
    sub_subject_id: {
        type: String,
    },
    subject_id: {
        type: String,
    },
    tutor_id: {
        type: String,
    },
    tutor_name: {
        type: String,
    },
    subject: {
        type: String,
    },
    sub_subject: {
        type: String,
    },
    question:{
        type: String,
    },
    image:{
        type: String,
    },
    amount:{
        type:Number,
    },
    deadline_time:{
        type: String,
    },
    deadline_date:{
        type: String,
    },
    pages:{
        type: Number,
    },
    order_id:{
        type: String,
    },
    reference:{
        type: String,
    },
    payment_status:{
        type: String,
        default: "unpaid"
    },
    type:{
        type: String,
        default: "assignment"
    },
    assignment_status:{
        type: String,
        default: "Pending"
    },
    transactions: {
        type: [TransactionSchema]
    },
    image:{
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);