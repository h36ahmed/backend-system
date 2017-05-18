var _ = require('underscore');
var models = require('../db.js');

var stripe = require("stripe")("pk_test_UnmAg8y934vAlD1EXAMsYC3V");

// GET /api/v1/createProfile
exports.createProfile = function (req, res) {
    var query = req.query;
    var where = {};

    var paymentDetails = _.pick(req.body, 'email', 'stripeToken', 'chargeAmount', 'overall', 'order_id');

    var email = req.body.email;
    var token = req.body.stripeToken;
    var chargeAmount = req.body.chargeAmount;
    var plan = req.body.plan;

    var customerStripeID;

    // Create a Customer:
    stripe.customers.create({
        email: "paying.user@example.com",
        source: token,
    }).then(function (customer) {
        customerStripeID = customer.id;
        return stripe.charges.create({
            amount: chargeAmount,
            currency: "cad",
            customer: customer.id,
        });
    }).then(function (charge) {

        stripe.subscriptions.create({
            customer: customer.id,
            plan: plan,
        }, function (err, subscription) {

        });

    });

};
