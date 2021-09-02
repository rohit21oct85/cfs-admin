const express = require("express");
const Book = require('../controllers/admin/BookController.js');
const checkAuth = require("../middleware/check-auth.js");

var multer = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    fileFilter: function(req, file, cb) {
        console.log(file.mimetype, "dadasd")
    },
    filename: function(req, file, cb) {
        console.log(file)
        cb(null, file.fieldname + '-' + Date.now() + '.csv')
    },
})

var upload = multer({ storage: storage })

const router = express.Router();

router
    .get('/subject/:sub_subject_id', checkAuth, Book.BooksBySubSubjectId)
    .get('/search/:isbn?', checkAuth, Book.searchBook)
    .get('/view-all/:sub_subject_id?/:pageno/:limit', checkAuth, Book.getAllBook)
    .post('/create', checkAuth, Book.createBook)
    .post('/upload', upload.single('file'), checkAuth, Book.uploadBook)
    .post('/bulk-upload', upload.single('file'), checkAuth, Book.BulkUploadBook)
    .patch('/update/:book_id', Book.updateBook)
    .patch('/update-all/:sub_subject_id', Book.updateAllBook)
    .delete('/delete/:id', Book.deleteBook)
    .delete('/delete-all', Book.deleteBookAll)
    .get('/view/:id?', Book.viewBook)
    .post('/add-review', checkAuth, Book.addReview)
    .get('/all-reviews/:book_id', checkAuth, Book.allReviews)
    .post('/upload-review', upload.single('file'), checkAuth, Book.UploadReviewCSV)
    .post('/update-published-status',checkAuth, Book.updatePublishedStatus)
    .post('/update-review-status',checkAuth, Book.updateReviewStatus)
    .delete('/delete-review/:book_id/:review_id',checkAuth, Book.deleteReview)
    .post('/add-faq', checkAuth, Book.addFaq)
    .get('/all-faqs/:book_id', checkAuth, Book.allFaqs)
    .delete('/delete-faq/:book_id/:faq_id',checkAuth, Book.deleteFaq)
    .post('/update-faq-status',checkAuth, Book.updateFaqStatus)
    .get('/total-questions/:book_isbn', checkAuth, Book.totalQuestions)
    .get('/seo/:book_id', checkAuth, Book.BookSeo)
    .post('/add-seo', checkAuth, Book.SaveBookSeo)
    .post('/addFields', checkAuth, Book.addFields)
    .get('/all-books/:sub_subject', checkAuth, Book.relatedBooks)
    .get('/similar-books/:book_id', checkAuth, Book.smimilarBooks)
    .post('/add-similar-books', checkAuth, Book.addSimilarBooks)
    .get('/upload-questions', checkAuth, Book.uploadQuestion)
;

module.exports = router;