var _ = require('underscore');
var models = require('../db.js');


// GET /api/v1/customers
exports.list = function(req, res) {
    var query = req.query;
    var where = {};
    var userWhere = {};
    var paymentPlanWhere = {};

    // QUERY PARAMETERS

    // fn -> First Name
    if (query.hasOwnProperty('first_name') && query.first_name.length > 0) {
        where.first_name = {
            $like: '%' + query.fn + '%'
        };
    }

    // ln -> Last Name
    if (query.hasOwnProperty('last_name') && query.last_name.length > 0) {
        where.last_name = {
            $like: '%' + query.ln + '%'
        };
    }

    // date_joined -> Date Joined
    if (query.hasOwnProperty('date_joined') && query.date_joined.length > 0) {
        where.date_joined = {
            $like: '%' + query.date_joined + '%'
        };
    }

    // email -> Email
    if (query.hasOwnProperty('email') && query.email.length > 0) {
        userWhere.email = {
            $like: '%' + query.email + '%'
        };
    }
    // type -> Type
    if (query.hasOwnProperty('type') && query.type.length > 0) {
        userWhere.type = {
            $like: '%' + query.type + '%'
        };
    }

    models.customers.findAll({
        attributes: ['id', 'first_name', 'last_name', 'phone_number', 'date_joined', 'profile_image', 'meals_remaining', 'phone_number', 'city', 'country', 'active', 'reminder_emails'],
        where: where,
        include: [{
            model: models.users,
            attributes: ['email'],
            where: userWhere
        }, {
            model: models.paymentPlans,
            where: paymentPlanWhere
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
    models.customers.findById(customerID).then(function(customer) {
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
    var customerDetails = _.pick(req.body, 'id', 'first_name', 'last_name', 'phone_number', 'date_joined', 'profile_image', 'meals_remaining', 'phone_number', 'city', 'country', 'profile_image', 'active', 'reminder_emails', 'paymentPlan_id', 'stripe_token', 'referral_code_used');

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
