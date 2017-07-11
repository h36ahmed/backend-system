var _ = require('underscore');
var models = require('../db.js');
var moment = require('moment');
var email = require('./email');
var cryptojs = require('crypto-js');

moment.tz.setDefault("America/Toronto");

//var stripe = require("stripe")("sk_test_shNAbxyQyXRm3LCZLmladgez");
var stripe = require("stripe")("sk_live_TZpALEAqujGW2Td9rpEod8fu");

// POST /api/v1/create-subscription
exports.createSubscription = function (req, res) {

    var paymentDetails = _.pick(req.body, 'email', 'stripe_token', 'plan', 'first_name', 'last_name', 'postal_code', 'password');

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
                var userAttributes = {
                    email: paymentDetails.email.toLowerCase(),
                    password: paymentDetails.password,
                    type: 'customer'
                }
                models.users.create(userAttributes).then(function (user) {
                    paymentDetails.user_id = user.id;
                    userAttributes.name = 'Lunch Society Member';
                    var attributes = {
                        first_name: paymentDetails.first_name,
                        last_name: paymentDetails.last_name,
                        meals_remaining: paymentDetails.plan.meals,
                        postal_code: paymentDetails.postal_code,
                        stripe_customer_id: customerStripeID,
                        stripe_subscription_id: subscription.id,
                        cycle_start_date: moment().format(),
                        cycle_end_date: moment().add(30, 'days').format(),
                        payment_plan_id: paymentDetails.plan.id,
                        user_id: paymentDetails.user_id
                    };
                    models.customers.create(attributes).then(function (customer) {
                        res.json(customer);
                        email.sendWelcomeEmail(userAttributes, res);
                    }, function (e) {
                        res.status(400).json(e);
                    });
                }, function (e) {
                    res.status(400).json(e);
                });

            }
        });
    }, function (e) {
        res.status(400).json(e);
    });

};

var updateSubscription = function (customerID, res) {

    models.customers.findById(customerID).then(function (customer) {
        if (customer) {
            stripe.subscriptions.update(customer.stripe_subscription_id, {
                plan: "the-12",
            }, function (err, subscription) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    var attributes = {
                        payment_plan_id: 1,
                        meals_remaining: 12
                    };
                    customer.update(attributes).then(function (customer) {
                        res.json(customer.toPublicJSON());
                    }, function (e) {
                        res.status(400).json(e);
                    });
                }
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });

};

exports.updateSubscription = updateSubscription;
