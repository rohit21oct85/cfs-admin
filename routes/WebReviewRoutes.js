const express = require("express");
const Review = require('../controllers/web/ReviewController.js');
const studentAuth = require('../middleware/student-auth')
const router = express.Router();

router
    .post('/:isbn', studentAuth, Review.addReview)


module.exports = router;