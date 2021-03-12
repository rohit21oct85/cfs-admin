const express = require("express");
const Book = require('../controllers/web/BookController.js');
const router = express.Router();

router
    .get('/view-all', Book.getAllBook)
    .get('/subject/:sub_subject_name', Book.BooksBySubSubjectName);
    
module.exports = router;