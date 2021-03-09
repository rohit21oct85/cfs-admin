const express = require("express");
const Category = require('../controllers/web/CategoryController.js');
const router = express.Router();

router
    .get('/view-all', Category.getAllCategory);
    
module.exports = router;