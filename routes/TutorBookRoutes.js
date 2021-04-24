const express = require("express");
const TutorBook = require('../controllers/tutor/TutorBooksController.js');
const tutorAuth = require("../middleware/tutor-auth.js");

const router = express.Router();

router
    .post('/open',tutorAuth, TutorBook.openBook)
    .post('/chapter-question',tutorAuth, TutorBook.chapterQuestion)
    .get('/start-answering',tutorAuth, TutorBook.startAnswering)
    .get('/answered',tutorAuth, TutorBook.getAnswered)
    .post('/finish-answer',tutorAuth, TutorBook.finishAnswer)
;

module.exports = router;