const express =  require("express");
const Auth = require('../controllers/admin/PermissionController.js');
const checkAuth =  require("../middleware/check-auth.js");
const adminAuth =  require("../middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreatePermission)
    .patch('/update/:id',checkAuth, adminAuth,Auth.UpdatePermission)
    .get('/view/:id',checkAuth,adminAuth, Auth.ViewPermission)
    .get('/view-all',checkAuth, adminAuth,Auth.ViewAllPermission)
    .delete('/delete-all',checkAuth, adminAuth,Auth.DeleteAllPermission)
    .delete('/delete/:id',checkAuth,adminAuth, Auth.DeletePermission);

module.exports = router;