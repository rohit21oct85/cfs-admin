const express = require("express");
const Book = require('../controllers/web/BookController.js');
const router = express.Router();

router
    .get('/view-all', Book.getAllBook)
    .post('/subject/:sub_subject_name', Book.BooksBySubSubjectName)
    .get('/subsubject/search/:subsubject/:isbn', Book.searchSubSubject)
    .get('/popular-books', Book.PopularBooks)
    .get('/search-chapter-question/:search', Book.searchChapterQuestion)
    .get('/search-book-name-isbn/:search', Book.searchBookNameIsbn)

    //used on book detail page
    .get('/book/:isbn', Book.getBook)
    .get('/book/chapter/:isbn', Book.getBookChapters)
    .get('/book/chapter/section/:isbn/:chapter_no', Book.getBookSections)
    .get('/book/chapter/section/exercise/:isbn/:chapter_no/:section_no', Book.getBookExercises)

    
module.exports = router;