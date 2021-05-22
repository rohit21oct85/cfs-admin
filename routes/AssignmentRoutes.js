const express = require("express");
const Assignment = require('../controllers/web/AssignmentController');
const studentAuth = require("../middleware/student-auth");

var multer = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    fileFilter: function(req, file, cb) {
        console.log(file.mimetype, "dadasd")
    },
    filename: function(req, file, cb) {
        // console.log(file)
        cb(null, file.originalname)
    },
})

var upload = multer({ storage: storage })

const router = express.Router();

router
    // .get('/all/:pageno/:limit',checkAuth, AdminStudent.getAllStudents)
    .post('/save-assignment', upload.single('file'), studentAuth, Assignment.saveAssignmentOne)
    .put('/save-assignment2', studentAuth, Assignment.saveAssignmentTwo)
;

module.exports = router;