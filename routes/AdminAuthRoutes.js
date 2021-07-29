const express =  require("express");
const Auth = require('../controllers/admin/AuthController.js');

const router = express.Router();

router
    .post('/register', Auth.Register)
    .post('/login', Auth.Login)
    .post('/add-fields', Auth.AddField)
    .post('/forgot-password', Auth.ForgotPassword)
    .post('/refresh-token', Auth.RefreshToken)
    .delete('/logout', Auth.Logout);
module.exports = router;