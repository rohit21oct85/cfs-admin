const express = require("express");
const Subject = require('../controllers/web/SubjectController.js');
const router = express.Router();

router
    .get('/all', Subject.AllSubjects)
    .get('/:subject_name', Subject.SubSubjects)
;
    
module.exports = router;