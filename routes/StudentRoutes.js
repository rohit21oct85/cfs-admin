const express = require("express");
const Student = require('../controllers/admin/StudentController.js');
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

router
.get('/all/:pageno/:limit',checkAuth, Student.getAllStudents)
;

module.exports = router;