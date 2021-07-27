const express =  require("express");
const Module = require('../controllers/admin/ModuleController.js');
const checkAuth =  require("../middleware/check-auth.js");
const adminAuth =  require("../middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Module.CreateModule)
    .patch('/update/:id',checkAuth,adminAuth, Module.UpdateModule)
    .post('/update-all',checkAuth, Module.UpdateAllModule)
    .get('/view/:id',checkAuth,adminAuth, Module.ViewModule)
    .get('/view-all',checkAuth, Module.ViewAllModule)
    .delete('/delete/:id', checkAuth,adminAuth, Module.DeleteModule);

module.exports = router;