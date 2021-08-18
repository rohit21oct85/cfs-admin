const express =  require("express");
const Auth = require('../controllers/admin/AdminController.js');
const checkAuth =  require("../middleware/check-auth.js");
const adminAuth =  require("../middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Auth.CreateAdmin)
    .patch('/update/:id',checkAuth,adminAuth, Auth.UpdateAdmin)
    .get('/view/:id',checkAuth,adminAuth, Auth.ViewAdmin)
    .get('/view-all',checkAuth,adminAuth, Auth.ViewAllAdmin)
    .delete('/delete/:id', checkAuth,adminAuth, Auth.DeleteAdmin)
    .get('/dashboard-statics',checkAuth,adminAuth, Auth.DashboardStatics)
;

module.exports = router;