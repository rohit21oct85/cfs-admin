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
    .get('/verify/:email/:token', Auth.Verify)
    .post('/sendreset', Auth.sendResetEmail)
    .post('/savegoogle', Auth.saveUser)
    .post('/changepassword', Auth.changePassword)
    .post('/verifyotp', Auth.verifyOtp)
    .post('/get-user',studentAuth, Auth.getUser)
    .post('/edit-user-profile',studentAuth, Auth.editUser)
    .get('/getcountries', Auth.getCountryList);

module.exports = router;