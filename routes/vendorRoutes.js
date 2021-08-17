const express = require("express");
const Vendor = require('../controllers/admin/VendorController.js');
const checkAuth = require("../middleware/check-auth.js");
const adminAuth =  require("../middleware/admin-auth.js");
const router = express.Router();

router
    .post('/create',checkAuth,adminAuth, Vendor.CreateVendor)
    .patch('/update/:id',checkAuth,adminAuth, Vendor.UpdateVendor)
    .get('/view/:id',checkAuth,adminAuth, Vendor.ViewVendor)
    .get('/view-all',checkAuth,adminAuth, Vendor.ViewAllVendor)
    .get('/delete/:id', checkAuth,adminAuth, Vendor.DeleteVendor)
;

module.exports = router;