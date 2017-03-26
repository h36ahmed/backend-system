var _ = require('underscore');
var models = require('../db.js');


// GET /api/v1/customers
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.customers.findAll({
        attributes: ['id', 'first_name', 'last_name', 'profile_image', 'status'],
        where: where,
        include: [{
            model: models.users,
            attributes: ['email']
        }, {
            model: models.payment_plans
        }]
    }).then(function(customers) {
        res.json(customers);
    }, function(e) {
        res.status(500).send();
    });
};

// GET /api/v1/customers/:id
exports.view = function(req, res) {
    var customerID = parseInt(req.params.id, 10);
    models.customers.findById(customerID, {
        include: [{
            model: models.users,
            attributes: ['email'],
            include: [{
                model: models.referral_codes,
                attributes: ['referral_code']
            }]
        }, {
            model: models.payment_plans
        }, {
            model: models.orders,
            attributes: ['id', 'order_date', 'status'],
            include: [{
                model: models.offers,
                attributes: ['id'],
                include: [{
                    model: models.meals,
                    attributes: ['name'],
                    include: [{
                        model: models.restaurants,
                        attributes: ['id', 'name']
                    }]
                }]
            }, {
                model: models.pickup_times,
                attributes: ['pickup_time']
            }]
        }, {
            model: models.invoices
        }]
    }).then(function(customer) {
        res.json(customer.toPublicJSON());
    }, function(e) {
        res.status(404).json(e);
    });
};

// GET /api/v1/customers-secure/:id
exports.secure = function(req, res) {
    var customerID = parseInt(req.params.id, 10);
    // When presenting a list option make option value user id and display value emails.
    models.customers.findById(customerID).then(function(customer) {
        res.json(customer.getStripeToken());
    }, function(e) {
        res.status(404).json(e);
    });
};

// POST /api/v1/customer
exports.create = function(req, res) {
    var customerDetails = _.pick(req.body, 'id', 'first_name', 'last_name', 'date_joined', 'profile_image', 'meals_remaining', 'postal_code', 'profile_image', 'reminder_emails', 'payment_plan_id', 'stripe_token', 'referral_code_used');

    models.customers.create(customerDetails).then(function(customer) {
        res.json(customer.toPublicJSON());
    }, function(e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/customer/:id
exports.delete = function(req, res) {
    var customerID = parseInt(req.params.id, 10);
    models.customers.destroy({
        where: {
            id: customerID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No customer found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
