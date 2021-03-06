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
    .get('/search/:isbn', checkAuth, Book.searchBook)
    .get('/view-all', checkAuth, Book.getAllBook)
    .post('/create', checkAuth, Book.createBook)
    .post('/upload', upload.single('file'), checkAuth, Book.uploadBook)
    .post('/bulk-upload', upload.single('file'), checkAuth, Book.BulkUploadBook)
    .patch('/update/:id', Book.updateBook)
    .delete('/delete/:id', Book.deleteBook)
    .get('/view/:id', Book.viewBook);

module.exports = router;