var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/payment-plans
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.payment_plans.findAll({
        where: where
    }).then(function(payment_plans) {
        res.json(payment_plans);
    }, function(e) {
        res.status(500).send();
    });
};

// POST /api/v1/payment-plan
exports.create = function(req, res) {
    var paymentPlanDetails = _.pick(req.body, 'name', 'description', 'image', 'price');
    models.payment_plans.create(paymentPlanDetails).then(function(paymentPlan) {
        res.json(paymentPlan);
    }, function(e) {
        res.status(400).json(e);
    });
};

// GET /api/v1/payment-plans/:id
exports.view = function(req, res) {
    var paymentPlanID = parseInt(req.params.id, 10);
    models.payment_plans.findById(paymentPlanID).then(function(paymentPlan) {
        res.json(paymentPlan.toJSON());
    },
    function(e) {
        res.status(404).json(e);
    });
};

// PUT /api/v1/payment-plan/:id
exports.update = function(req, res) {
    var paymentPlanID = parseInt(req.params.id, 10);

    var body = _.pick(req.body, 'name', 'description', 'image', 'price');

    var attributes = {};

    if (body.hasOwnProperty('name')) {
        attributes.name = body.name;
    }

    if (body.hasOwnProperty('description')) {
        attributes.password = body.password;
    }

    if (body.hasOwnProperty('price')) {
        attributes.price = body.price;
    }

    if (body.hasOwnProperty('image')) {
        attributes.image = body.image;
    }

    models.payment_plans.findById(paymentPlanID).then(function(paymentPlan) {
        if (paymentPlan) {
            paymentPlan.update(attributes).then(function(paymentPlan) {
                res.json(paymentPlan);
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

// DELETE /api/v1/payment-plan/:id
exports.delete = function(req, res) {
    var paymentPlanID = parseInt(req.params.id, 10);
    models.payment_plans.destroy({
        where: {
            id: paymentPlanID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No payment plan found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
