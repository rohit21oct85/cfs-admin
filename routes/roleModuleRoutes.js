const express =  require("express");
const Auth = require('../controllers/admin/RoleModuleController.js');
const checkAuth =  require("../middleware/check-auth.js");
const adminAuth =  require("../middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreateRoleModule)
    .patch('/update/:id',checkAuth, adminAuth,Auth.UpdateRoleModule)
    .get('/view/:role_id?/:email?',checkAuth, Auth.ViewRoleModule)
    .get('/details/:role_id',checkAuth, Auth.ViewRoleDetails)
    .get('/view-all',checkAuth, adminAuth,Auth.ViewAllRoleModule)
    .get('/users/:role',checkAuth, adminAuth,Auth.ViewRoleUsers)
    .get('/permissions/:module_slug?/:role?/:email?',checkAuth, adminAuth,Auth.ViewRolePermission)
    .get('/all-permissions/:role?/:email?',checkAuth, adminAuth,Auth.ViewAllRolePermission)

    .post('/delete-all',checkAuth, adminAuth,Auth.DeleteAllRoleModule)
    .post('/delete?',checkAuth,adminAuth, Auth.DeleteRoleModule);

module.exports = router;