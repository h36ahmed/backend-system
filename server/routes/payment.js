var _ = require('underscore');
var models = require('../db.js');
var moment = require('moment');
var email = require('./email');
var cryptojs = require('crypto-js');

moment.tz.setDefault("America/Toronto");

var stripe = require("stripe")("sk_test_shNAbxyQyXRm3LCZLmladgez");

// POST /api/v1/create-subscription
exports.createSubscription = function (req, res) {

    var paymentDetails = _.pick(req.body, 'email', 'stripe_token', 'plan', 'first_name', 'last_name', 'postal_code', 'customer_id', 'user_id', 'password');

    var userAttributes = {
        email: paymentDetails.email.toLowerCase(),
        password: paymentDetails.password,
        type: 'customer'
    }

    if (paymentDetails.user_id == null || typeof paymentDetails.user_id === 'undefined') {
        console.log(userAttributes);
        models.users.create(userAttributes).then(function(user) {
            paymentDetails.user_id = user.id;
            userAttributes.name = 'Lunch Society Member';
            createCustomer(paymentDetails, userAttributes, res)
        }, function(e) {
            res.status(400).json(e);
        });

    } else {
        createCustomer(paymentDetails, userAttributes, res)
    }


};

function createCustomer(paymentDetails, userAttributes, res) {
    stripe.customers.create({
        email: paymentDetails.email,
        source: paymentDetails.stripe_token
    }).then(function (customer) {
        customerStripeID = customer.id;
        stripe.subscriptions.create({
            customer: customerStripeID,
            plan: paymentDetails.plan.stripe_id,
            tax_percent: 13
        }, function (err, subscription) {
            if (err) {
                res.status(400).send(err);
            } else {
                var attributes = {
                    first_name: paymentDetails.first_name,
                    last_name: paymentDetails.last_name,
                    meals_remaining: paymentDetails.plan.meals,
                    postal_code: paymentDetails.postal_code,
                    stripe_token: customerStripeID,
                    cycle_start_date: moment().format(),
                    cycle_end_date: moment().add(30, 'days').format(),
                    payment_plan_id: paymentDetails.plan.id,
                    user_id: paymentDetails.user_id
                };
                models.customers.create(attributes).then(function (customer) {
                    customer.routeToCreateProfile = false;
                    email.sendWelcomeEmail(userAttributes, res);
                }, function (e) {
                    res.status(400).json(e);
                });
            }
        });
    });
}
