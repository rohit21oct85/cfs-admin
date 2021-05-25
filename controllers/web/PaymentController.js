const Student = require('../../models/student/Student.js');

const Razorpay = require('razorpay')
var instance = new Razorpay({
    key_id: process.env.razor_pay_key,
    key_secret: process.env.razor_pay_secret
})

const stripe = require('stripe')(process.env.stripe_p_key);

const createSubscription = async(req, res) => {
    try {
        const data = await instance.subscriptions.create({plan_id: process.env.plan_id,"quantity": 1,"total_count":12,customer_notify:1})
        return res.status(200).json({
            data: data
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error
        });
    }
}

const createOrder = async(req, res) => {
    console.log(req.body.amt)
    try {
        const options = {
            amount: req.body.amt,  // amount in the smallest currency unit
            currency: "USD",
        };
        const data = await instance.orders.create(options)
        return res.status(200).json({
            data: data
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error
        });
    }
}

const createCustomer = async(req, res) => {
    try {
        
        return res.status(200).json({
            data: data
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const saveTransaction = async(req, res) => {
    try {
        const filter = {_id: req.body.userId};
        const data = {
            subscription_id: req.body.subscription_id, 
            payment_id: req.body.payment_id,
            type: "subscription",
            SubscribeDate: Date.now(),
        }
        const transaction = await Student.findOneAndUpdate(filter,{$set: { transactions : data } });
        if(transaction){
            const stud = await Student.findOneAndUpdate(filter, {Subscribe : true});
            return res.status(200).json({
                data: stud
            });
        }
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

module.exports = {
    createSubscription,
    saveTransaction,
    createCustomer,
    createOrder,
}