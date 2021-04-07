const express = require("express");
const Faq = require('../controllers/web/FaqController.js');
const router = express.Router();

router
    .get('/get-faq-category', Faq.getFaqCategory)
    .get('/get-category-content/:cat', Faq.getCategoryContent)
;
    
module.exports = router;