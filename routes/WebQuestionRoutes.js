const express = require("express");
const Question = require('../controllers/web/QuestionController.js');
const router = express.Router();

router
    .post('/search-question', Question.searchQuestion)

module.exports = router;