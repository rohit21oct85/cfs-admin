const express = require("express");
const Tutor = require('../controllers/admin/TutorController.js');
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

router
.get('/all/:status?/:pageno?/:limit?',checkAuth, Tutor.getAllTutor)
;

module.exports = router;