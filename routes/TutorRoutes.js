const express = require("express");
const Tutor = require('../controllers/admin/TutorController.js');
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

router
.get('/all/:status?/:master_subject?/:pageno?/:limit?',checkAuth, Tutor.getAllTutor)
.post('/update-status',checkAuth, Tutor.updateStatus)
;

module.exports = router;