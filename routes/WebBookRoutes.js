const express = require("express");
const Book = require('../controllers/web/BookController.js');
const router = express.Router();

router
    .get('/view-all', Book.getAllBook)
    .get('/:isbn', Book.getBook)
    .post('/subject/:sub_subject_name', Book.BooksBySubSubjectName)
    .get('/subsubject/search/:subsubject/:isbn', Book.searchSubSubject)
    .get('/popular-books', Book.PopularBooks)
    .get('/search-chapter-question/:search', Book.searchChapterQuestion)
    .get('/search-book-name-isbn/:search', Book.searchBookNameIsbn)
    
module.exports = router;