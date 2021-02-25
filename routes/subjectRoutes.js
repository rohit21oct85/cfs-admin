const express =  require("express");
const Subject = require('../controllers/admin/SubjectController.js');
const checkAuth =  require("../middleware/check-auth.js");

const router = express.Router();

router
    .get('/all',checkAuth, Subject.getAllSubject)
    .post('/create',checkAuth, Subject.createSubject)
    .patch('/update/:id',Subject.updateSubject)
    .delete('/delete/:id',Subject.deleteSubject)
    .get('/view/:id',Subject.viewSubject);

module.exports = router;