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
.get('/single-question/:q_id',  checkAuth, Chapter.GetSingleQuestion)
.patch('/add-question/:q_id',  checkAuth, Chapter.AddSingleQuestion)
.post('/upload', upload.single('file'), checkAuth, Chapter.UploadChapters)
.post('/update-chapter-csv', upload.single('file'), checkAuth, Chapter.UdateChaptersCSV)
.delete('/delete/:isbn', Chapter.RemoveBookChapters)
.get('/all/:isbn', Chapter.getBookChapters)
.get('/section/:isbn/:chapter_no', Chapter.getBookSections)
.get('/download/:isbn', Chapter.downloadBooks)
.get('/exercise/:isbn/:chapter_no/:section_no', Chapter.getBookExercises)
.get('/problem/:isbn/:chapter_no/:section_no/:excerise_no', Chapter.getBookProblems)
.get('/only-problem/:isbn/:chapter_no', Chapter.getBookOnlyProblems)
.get('/search-question/:isbn/:search', Chapter.searchQuestion)
;

module.exports = router;