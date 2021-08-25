const express = require("express");
const ChieldSubject = require('../controllers/admin/ChieldSubjectController.js');
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();


router
    .get('/all/:subject_id?/:sub_subject_id?/:status?', checkAuth, ChieldSubject.AllChieldSubject)
    .get('/add-fields/:chield_subject_id', checkAuth, ChieldSubject.addFields)
    .post('/delete-chapters', checkAuth, ChieldSubject.deleteChieldSbjects)
;

module.exports = router;