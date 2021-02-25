const express =  require("express");
const Auth = require('../controllers/admin/PermissionGroupController.js');
const checkAuth =  require("../middleware/check-auth.js");
const adminAuth =  require("../middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreatePermissionGroup)
    .patch('/update/:id',checkAuth, adminAuth,Auth.UpdatePermissionGroup)
    .get('/view/:id',checkAuth,adminAuth,  Auth.ViewPermissionGroup)
    .get('/view-all',checkAuth,adminAuth, Auth.ViewAllPermissionGroup)
    .delete('/delete/:id',checkAuth,adminAuth, Auth.DeletePermissionGroup);

module.exports = router;