const express = require("express");
const Tutor = require('../controllers/admin/TutorController.js');
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    fileFilter: function(req, file, cb) {
        console.log(file.mimetype, "dadasd")
    },
    filename: function(req, file, cb) {
        console.log(file)
        cb(null, file.fieldname + '-' + Date.now() + '.csv')
    },
})

var upload = multer({ storage: storage })
router
.get('/all/:status?/:master_subject?/:type?/:pageno?/:limit?',checkAuth, Tutor.getAllTutor)
.post('/update-status',checkAuth, Tutor.updateStatus)
.post('/upload',upload.single('file'),checkAuth, Tutor.uploadTutorCSV)
.get('/details/:tutor_id',checkAuth, Tutor.tutorDetails)
.get('/add-fields',checkAuth, Tutor.addFields)
;

module.exports = router;