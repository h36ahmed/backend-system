var _ = require('underscore');
var models = require('../db.js');

var stripe = require("stripe")("sk_test_shNAbxyQyXRm3LCZLmladgez");

// POST /api/v1/createSubscription
exports.createSubscription = function (req, res) {
    var paymentDetails = _.pick(req.body, 'email', 'stripe_token', 'plan', 'first_name', 'last_name', 'postal_code');

    // Create a Customer:
    stripe.customers.create({
        email: paymentDetails.email,
        source: paymentDetails.token
    }).then(function (customer) {
        customerStripeID = customer.id;
        stripe.subscriptions.create({
          customer: customer.id,
          plan: paymentDetails.plan.stripe_id,
        }, function(err, subscription) {
          if (err) {
              res.status(400);
          } else {
              res.json(subscription);
          }
        });
    });

};
