const express = require("express");
const Chapter = require('../controllers/web/ChapterController.js');
const router = express.Router();

router
    .get('/all/:isbn', Chapter.getBookChapters)
    .get('/section/:isbn', Chapter.getBookSections)
    .get('/exercise/:isbn', Chapter.getBookExercises)
    .get('/problem/:isbn', Chapter.getBookProblems)
;
    
module.exports = router;