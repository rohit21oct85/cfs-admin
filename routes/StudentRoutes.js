const express = require("express");
const AdminStudent = require('../controllers/admin/StudentController.js');
const Student = require('../controllers/student/StudentController.js');
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

router
    .get('/modify-notification',Student.modifyNotification)
    .get('/all/:pageno/:limit',checkAuth, AdminStudent.getAllStudents)
    .post('/ask-question',checkAuth, Student.askQuestion)
    .get('/user-question/:flag?',checkAuth, Student.userQuestion)
    .get('/user-notify/:isRead?',checkAuth, Student.userNotifications)
    .patch('/update-notification/:id',checkAuth, Student.readNotifications)
    .post('/check-book-isbn/:isbn',checkAuth,Student.checkBookIsbn)
    .get('/my-textbook',checkAuth, Student.myTextBook)
    .get('/my-subscription-details', checkAuth, Student.mySubscription)
    .post('/my-textbook-del', checkAuth, Student.deleteTextBook)
;

module.exports = router;