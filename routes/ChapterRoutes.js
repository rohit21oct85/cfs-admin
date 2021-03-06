const express = require("express");
const Chapter = require('../controllers/admin/ChapterController.js');
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
.get('/questions/:isbn',  checkAuth, Chapter.GetChapterQuestions)
.post('/upload', upload.single('file'), checkAuth, Chapter.UploadChapters)
.get('/all/:isbn', Chapter.getBookChapters)
.get('/section/:isbn', Chapter.getBookSections)
.get('/exercise/:isbn', Chapter.getBookExercises)
.get('/problem/:isbn', Chapter.getBookProblems)
;

module.exports = router;