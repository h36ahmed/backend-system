var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/payouts
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.payouts.findAll({
        where: where,
        include: [{
            model: models.restaurants,
            include: [{
                model: models.owners,
                attributes: ['id', 'first_name', 'last_name'],
                include: [{
                    model: models.users,
                    attributes: ['email']
                }]

            }]
        }]
    }).then(function(payouts) {
        res.json(payouts);
    }, function(e) {
        res.status(500).send();
    });
};

// POST /api/v1/payout
exports.create = function(req, res) {
    var payoutDetails = _.pick(req.body, 'payout_date', 'status', 'tax_amount', 'total_payment_before_tax', 'notes', 'restaurant_id', 'total_meals', 'week_id');
    models.payouts.create(payoutDetails).then(function(payout) {
        res.json(payout);
    }, function(e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/payout/:id
exports.delete = function(req, res) {
    var payoutID = parseInt(req.params.id, 10);
    models.payouts.destroy({
        where: {
            id: payoutID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No payout found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
