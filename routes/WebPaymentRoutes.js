const express = require("express");
const Payment = require('../controllers/web/PaymentController.js');
const studentAuth = require('../middleware/student-auth')
const router = express.Router();

router
    .post('/razorpay-create-subs',studentAuth, Payment.createSubscription)
    .post('/stripe-create-customer', studentAuth, Payment.createCustomer)

    .post('/save-transaction',studentAuth, Payment.saveTransaction)
    .post('/razorpay-create-order',studentAuth, Payment.createOrder)
;
    
module.exports = router;