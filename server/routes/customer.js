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


// PUT /api/v1/customer/:id
exports.update = function(req, res) {
    var customerID = parseInt(req.params.id, 10);
    var body = _.pick(req.body,  'first_name', 'last_name', 'profile_image', 'meals_remaining', 'postal_code', 'reminder_emails', 'payment_plan_id', 'stripe_token', 'referral_code_used', 'status', 'cycle_start_date', 'cycle_end_date');
    var attributes = {};

    if (body.hasOwnProperty('first_name')) {
        attributes.first_name = body.first_name;
    }

    if (body.hasOwnProperty('last_name')) {
        attributes.last_name = body.last_name;
    }

    if (body.hasOwnProperty('profile_image')) {
        attributes.profile_image = body.profile_image;
    }

    if (body.hasOwnProperty('meals_remaining')) {
        attributes.meals_remaining = body.meals_remaining;
    }

    if (body.hasOwnProperty('postal_code')) {
        attributes.postal_code = body.postal_code;
    }

    if (body.hasOwnProperty('reminder_emails')) {
        attributes.reminder_emails = body.reminder_emails;
    }

    if (body.hasOwnProperty('payment_plan_id')) {
        attributes.payment_plan_id = body.payment_plan_id;
    }

    if (body.hasOwnProperty('referral_code_used')) {
        attributes.referral_code_used = body.referral_code_used;
    }

    if (body.hasOwnProperty('stripe_token')) {
        attributes.stripe_token = body.stripe_token;
    }

    if (body.hasOwnProperty('status')) {
        attributes.status = body.status;
    }

    if (body.hasOwnProperty('cycle_start_date')) {
        attributes.cycle_start_date = body.cycle_start_date;
    }

    if (body.hasOwnProperty('cycle_end_date')) {
        attributes.cycle_end_date = body.cycle_end_date;
    }

    models.customers.findById(customerID).then(function(customer) {
        if (customer) {
            customer.update(attributes).then(function(customer) {
                res.json(customer);
            }, function(e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    });
};

// POST /api/v1/customer
exports.create = function(req, res) {
    var customerDetails = _.pick(req.body, 'user_id', 'first_name', 'last_name', 'date_joined', 'profile_image', 'meals_remaining', 'postal_code', 'reminder_emails', 'payment_plan_id', 'stripe_token', 'referral_code_used', 'status', 'cycle_start_date', 'cycle_end_date');

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
