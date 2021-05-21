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
    .post('/bartley-chapters',  checkAuth, Chapter.SaveBartlebyChapters)
    .get('/bartelby-chapters/:isbn/:status',  checkAuth, Chapter.BartelbyChapters)
    .post('/bartelby-update-chapters',  checkAuth, Chapter.BartelbyUpdatesChapters)
    .post('/bartelby-clear-chapter',  checkAuth, Chapter.BartelbyClearChapters)
    .post('/bartelby-upload-data', checkAuth, Chapter.BartelbyImportChapter)
    .post('/bartelby-clear-all',  checkAuth, Chapter.BartelbyClearAllChapters)
    .get('/bartelby-question-answers/:book_isbn/:section_id',  checkAuth, Chapter.BartelbyQuestionAnswers)
    .post('/bartelby-chapter-change-status',  checkAuth, Chapter.BartelbyChaptersChangeStatus)
    .post('/update-chapter-answer',  checkAuth, Chapter.BartelbyChaptersAnswer)
    .get('/questions/:isbn',  checkAuth, Chapter.GetChapterQuestions)
    .get('/qc-chapter-questions/:isbn/:chapter_no?/:status?',  checkAuth, Chapter.GetQCChapterQuestions)
    .get('/qc-data/:isbn',  checkAuth, Chapter.getQCData)
    .post('/qc-answers',  checkAuth, Chapter.QCAnswer)
    .get('/single-question/:q_id',  checkAuth, Chapter.GetSingleQuestion)
    .patch('/add-question/:q_id',  checkAuth, Chapter.AddSingleQuestion)
    .post('/upload', upload.single('file'), checkAuth, Chapter.UploadChapters)
    .post('/update-chapter-csv', upload.single('file'), checkAuth, Chapter.UdateChaptersCSV)
    .post('/import-data', checkAuth, Chapter.importChapter)
    .delete('/delete/:isbn', checkAuth, Chapter.RemoveBookChapters)
    .get('/all/:isbn', checkAuth,Chapter.getBookChapters)
    .get('/section/:isbn/:chapter_no',  checkAuth, Chapter.getBookSections)
    .get('/exercise/:isbn/:chapter_no/:section_no', checkAuth, Chapter.getBookExercises)
    .get('/problem/:isbn/:chapter_no/:section_no/:excerise_no', checkAuth, Chapter.getBookProblems)
    .get('/only-problem/:isbn/:chapter_no', checkAuth,Chapter.getBookOnlyProblems)
    .get('/download/:isbn', checkAuth,Chapter.downloadBooks)
    .get('/clearfields',checkAuth, Chapter.clearFields)
    .get('/addfields',checkAuth, Chapter.addFields)
    .get('/search-question/:isbn/:search', checkAuth,Chapter.searchQuestion)
;

module.exports = router;