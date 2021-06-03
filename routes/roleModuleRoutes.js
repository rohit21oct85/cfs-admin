const express =  require("express");
const Auth = require('../controllers/admin/RoleModuleController.js');
const checkAuth =  require("../middleware/check-auth.js");
const adminAuth =  require("../middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreateRoleModule)
    .patch('/update/:id',checkAuth, adminAuth,Auth.UpdateRoleModule)
    .get('/view/:role_id/:role_name',checkAuth,adminAuth, Auth.ViewRoleModule)
    .get('/view-all',checkAuth, adminAuth,Auth.ViewAllRoleModule)
    .delete('/delete-all',checkAuth, adminAuth,Auth.DeleteAllRoleModule)
    .delete('/delete/:id',checkAuth,adminAuth, Auth.DeleteRoleModule);

module.exports = router;