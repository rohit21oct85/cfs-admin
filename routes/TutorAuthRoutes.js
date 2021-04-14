const express = require("express");
const Auth = require('../controllers/tutor/TutorAuthController.js');
const tutorAuth = require("../middleware/tutor-auth.js");
const router = express.Router();

router
    .post('/register', Auth.Register)
    .post('/login', Auth.Login)
    .post('/forgot-password', Auth.ForgotPassword)
    .post('/change-password',tutorAuth, Auth.ChangePassword)
    .post('/refresh-token', Auth.RefreshToken)
    .delete('/logout', Auth.Logout);

module.exports = router;