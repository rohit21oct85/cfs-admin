const express =  require("express");
const Auth = require('../controllers/admin/RoleController.js');
const checkAuth =  require("../middleware/check-auth.js");
const adminAuth =  require("../middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreateRole)
    .patch('/update/:id',checkAuth,adminAuth, Auth.UpdateRole)
    .get('/view/:id',checkAuth,adminAuth, Auth.ViewRole)
    .get('/view-all',checkAuth, Auth.ViewAllRole)
    .delete('/delete/:id',checkAuth,adminAuth, Auth.DeleteRole);
module.exports = router;