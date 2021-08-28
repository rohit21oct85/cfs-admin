const express = require("express");
const Subject = require('../controllers/web/SubjectController.js');
const router = express.Router();

router
    .get('/all', Subject.AllSubjects)
    .get('/:subject_name', Subject.SubSubjects)
    .get('/childsubjects/:sub_subject_name', Subject.GetChildSubjects)
    .post('/questions/:child_subject', Subject.GetQuestionAndAnswers)
    .post('/get-answer/:old_id', Subject.GetAnswer)
;
    
module.exports = router;