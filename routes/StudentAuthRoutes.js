const express = require("express");
const Auth = require('../controllers/student/StudentAuthController.js');
const studentAuth = require("../middleware/student-auth.js");
const router = express.Router();

router
    .post('/register', Auth.Register)
    .post('/login', Auth.Login)
    .post('/forgot-password', Auth.ForgotPassword)
    .post('/refresh-token', Auth.RefreshToken)
    .delete('/logout', Auth.Logout)
    .get('/verify/:email/:token', Auth.Verify);

module.exports = router;