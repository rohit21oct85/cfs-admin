const express = require("express");
const Auth = require('../controllers/tutor/TutorAuthController.js');
const tutorAuth = require("../middleware/tutor-auth.js");

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
        cb(null, file.fieldname +'-'+ file.originalname)
    },
})

var upload = multer({ storage: storage })

const router = express.Router();

router
    .post('/register', Auth.Register)
    .post('/login', Auth.Login)
    .post('/forgot-password', Auth.ForgotPassword)
    .post('/change-password',tutorAuth, Auth.ChangePassword)
    .post('/refresh-token', Auth.RefreshToken)
    .delete('/logout', Auth.Logout)
    .post('/save-profile-info',Auth.saveProfileInfo)
    .post('/save-education', upload.single('file'), Auth.saveEducation)
    .post('/save-mastered-subject', upload.single('file'), Auth.masteredSubject)
    .post('/save-bank-details', Auth.saveBankDetails)
    .get('/view-all', Auth.getAllCategory)
    .post('/get-tutor-details', Auth.getTutorDetails);

module.exports = router;