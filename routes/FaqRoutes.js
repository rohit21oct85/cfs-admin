const express = require("express");
const Faq = require('../controllers/admin/FaqController.js');
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

router
.get('/all/:pageno/:limit',checkAuth, Faq.getAllFaqs)
.get('/single/:faq_id',checkAuth, Faq.getSingleFaqs)
.post('/add-question/:faq_id',checkAuth, Faq.AddFaqQuestion)
.post('/add-category',checkAuth, Faq.AddCategory)
;

module.exports = router;