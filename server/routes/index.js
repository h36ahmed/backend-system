var express = require('express');
var router = express.Router();
var models = require('../db.js');
var middleware = require('../middleware.js')(models);

// Route Files
var user = require('./user');
var owner = require('./owner');
var customer = require('./customer');
var restaurant = require('./restaurant');
var meal = require('./meal');
var offer = require('./offer');
var order = require('./order');
var paymentPlan = require('./paymentPlan');
var referralCode = require('./referralCode');
var invoice = require('./invoice');
var feedback = require('./feedback');
var aws = require('./aws');
var email = require('./email');
var week = require('./week');
var payout = require('./payout');
var pickUpTime = require('./pickUpTime');


router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
});

// Views
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Lunch Society'
    });
});

// Users
router.get('/api/v1/users', middleware.requireAuthentication, user.list);
router.get('/api/v1/users/:id', middleware.requireAuthentication, user.view);
router.post('/api/v1/user', user.create);
router.post('/api/v1/users/login', user.login);
router.put('/api/v1/user/:id', middleware.requireAuthentication, user.update);
//router.delete('/api/v1/user/:id', middleware.requireAuthentication, user.delete);
router.delete('/api/v1/users/login', middleware.requireAuthentication, user.logout);


// Owners
router.get('/api/v1/owners', middleware.requireAuthentication, owner.list);
router.get('/api/v1/owners/:id', middleware.requireAuthentication, owner.view);
router.post('/api/v1/owner', owner.create);
router.put('/api/v1/owner/:id', middleware.requireAuthentication, owner.update);
router.delete('/api/v1/owner/:id', middleware.requireAuthentication, owner.delete);

// Customers
router.get('/api/v1/customers', middleware.requireAuthentication, customer.list);
router.get('/api/v1/customers/:id', middleware.requireAuthentication, customer.view);
router.put('/api/v1/customer/:id', middleware.requireAuthentication, customer.update);
router.post('/api/v1/customer', middleware.requireAuthentication, customer.create);
// router.delete('/api/v1/customer/:id', middleware.requireAuthentication, customer.delete);

// Restaurants
router.get('/api/v1/restaurants', middleware.requireAuthentication, restaurant.list);
router.get('/api/v1/restaurants/:id', middleware.requireAuthentication, restaurant.view);
router.post('/api/v1/restaurant', middleware.requireAuthentication, restaurant.create);
router.put('/api/v1/restaurant/:id', middleware.requireAuthentication, restaurant.update);
router.delete('/api/v1/restaurant/:id', middleware.requireAuthentication, restaurant.delete);

// Meals
router.get('/api/v1/meals', middleware.requireAuthentication, meal.list);
router.get('/api/v1/meals/:id', middleware.requireAuthentication, meal.view);
router.post('/api/v1/meal', middleware.requireAuthentication, meal.create);
router.put('/api/v1/meal/:id', middleware.requireAuthentication, meal.update);
router.delete('/api/v1/meal/:id', middleware.requireAuthentication, meal.delete);

// Meal Offers
router.get('/api/v1/offers', middleware.requireAuthentication, offer.list);
router.post('/api/v1/offer', middleware.requireAuthentication, offer.create);
router.delete('/api/v1/offer/:id', middleware.requireAuthentication, offer.delete);
router.put('/api/v1/offer/:id', middleware.requireAuthentication, offer.update)

// Orders
router.get('/api/v1/orders', middleware.requireAuthentication, order.list);
router.post('/api/v1/order', middleware.requireAuthentication, order.create);
router.get('/api/v1/orders/:id', middleware.requireAuthentication, order.view);
//router.delete('/api/v1/order/:id', middleware.requireAuthentication, order.delete);

// Payment Plans
router.get('/api/v1/payment-plans', middleware.requireAuthentication, paymentPlan.list);
router.get('/api/v1/payment-plans/:id', middleware.requireAuthentication, paymentPlan.view);
router.post('/api/v1/payment-plan', middleware.requireAuthentication, paymentPlan.create);
router.put('/api/v1/payment-plan/:id', middleware.requireAuthentication, paymentPlan.update);
router.delete('/api/v1/payment-plan/:id', middleware.requireAuthentication, paymentPlan.delete);

// Referral Codes
router.get('/api/v1/referral-codes', middleware.requireAuthentication, referralCode.list);
router.post('/api/v1/referral-code', middleware.requireAuthentication, referralCode.create);
router.delete('/api/v1/referral-code/:id', middleware.requireAuthentication, referralCode.delete);

// Feedbacks
router.get('/api/v1/feedbacks', middleware.requireAuthentication, feedback.list);
router.post('/api/v1/feedback', middleware.requireAuthentication, feedback.create);
router.delete('/api/v1/feedback/:id', middleware.requireAuthentication, feedback.delete);

// Invoices
router.get('/api/v1/invoices', middleware.requireAuthentication, invoice.list);
router.post('/api/v1/invoice', middleware.requireAuthentication, invoice.create);
//router.delete('/api/v1/invoice/:id', middleware.requireAuthentication, invoice.delete);

// Amazon
router.post('/api/v1/signing', middleware.requireAuthentication, aws.signing);

// Email
router.post('/api/v1/sendEmail', middleware.requireAuthentication, email.sendEmail);
router.post('/api/v1/sendROEmail', middleware.requireAuthentication, email.sendROEmail);

// Payouts
router.get('/api/v1/payouts', middleware.requireAuthentication, payout.list);
router.post('/api/v1/payout', middleware.requireAuthentication, payout.create);

// Weeks
router.get('/api/v1/weeks', middleware.requireAuthentication, week.list);
router.get('/api/v1/week/:id', middleware.requireAuthentication, week.view);

// Pickup Times
router.get('/api/v1/pickup-times', middleware.requireAuthentication, pickUpTime.list);

module.exports = router;
