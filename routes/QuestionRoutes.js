const express = require("express");
const Question = require('../controllers/admin/QuestionController.js');
const checkAuth = require("../middleware/check-auth.js");
const adminAuth = require("../middleware/admin-auth.js");

const router = express.Router();

router
    .post('/import-data',  checkAuth, Question.importData)
    .get('/chield-question/:chield_subject_id',  checkAuth, Question.chieldQuestion)
    .get('/delete/:chield_subject_id',  checkAuth, Question.deleteChieldQuestion)
;

module.exports = router;