var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/payment-plans
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.paymentPlans.findAll({
        where: where
    }).then(function(paymentPlans) {
        res.json(paymentPlans);
    }, function(e) {
        res.status(500).send();
    });
};

// POST /api/v1/payment-plan
exports.create = function(req, res) {
    var paymentPlanDetails = _.pick(req.body, 'name', 'description', 'image', 'price');
    models.paymentPlans.create(paymentPlanDetails).then(function(paymentPlan) {
        res.json(paymentPlan);
    }, function(e) {
        res.status(400).json(e);
    });
};

// GET /api/v1/payment-plans/:id
exports.view = function(req, res) {
    var paymentPlanID = parseInt(req.params.id, 10);
    models.paymentPlans.findById(paymentPlanID).then(function(paymentPlan) {
                res.json(paymentPlan).toJSON());
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

    if (body.hasOwnProperty('email')) {
        attributes.email = body.email;
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

    models.paymentPlans.findById(paymentPlanID).then(function(paymentPlan) {
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
    models.paymentPlans.destroy({
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
