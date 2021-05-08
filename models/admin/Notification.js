const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title:{type: String},
    user_Id: {type: String},
    type: {type: String},
    isRead: {
        type: Boolean,
        default: 0
    },
    status:{
        type: Boolean,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);