const express =  require("express");
const SubSubject = require('../controllers/admin/SubSubjectController.js');
const checkAuth =  require("../middleware/check-auth.js");

const router = express.Router();

router
    .get('/subject/:subject_id',checkAuth, SubSubject.AllSubSubject)
    .get('/all',checkAuth, SubSubject.getAllSubSubject)
    .post('/create',checkAuth, SubSubject.createSubSubject)
    .patch('/update/:id',SubSubject.updateSubSubject)
    .delete('/delete/:id',SubSubject.deleteSubSubject)
    .get('/view/:id',SubSubject.viewSubSubject);

module.exports = router;