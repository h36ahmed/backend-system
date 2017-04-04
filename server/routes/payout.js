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

    var payoutDetails = _.pick(req.body, 'week_id');
    var weekID = parseInt(payoutDetails.week_id, 10);
    var where = {};

    models.weeks.findById(weekID).then(function(week) {
        var weekDetails = week.toJSON();
        models.restaurants.findAll({
            where: where,
            attributes: ['name'],
            include: [{
                model: models.meals,
                attributes: ['name', 'price'],
                include: [{
                    model: models.offers,
                    attributes: ['plates_assigned', 'plates_left', 'offer_date'],
                    where: {
                        offer_date: {
                            $gt: weekDetails.from_date,
                            $lte: weekDetails.to_date
                        }
                    }
                }]
            }]
        }).then(function(restuarants) {
            var payouts = [];
            _.each(restuarants, function(restaurant) {
                var payout = {
                    restaurant: '',
                    total_meals: 0,
                    total_payment_before_tax: 0,
                    tax_amount: 0,
                    total_amount: 0
                };
                payout.restaurant = restaurant.name;
                _.each(restaurant.meals, function(meal) {
                    _.each(meal.offers, function(offer) {
                        var totalPlatesServed = offer.plates_assigned - offer.plates_left;
                        payout.total_payment_before_tax += totalPlatesServed * meal.price;
                        payout.total_meals += totalPlatesServed;
                    });
                });
                payout.tax_amount = payout.total_payment_before_tax * 0.13;
                payout.total_amount = payout.total_payment_before_tax + payout.tax_amount;
                payouts.push(payout);
            });
            models.payouts.bulkCreate(payouts).then(function(bulk) {
                res.status(204).send();
            }, function(err) {
                res.status(500).send();
            });
        }, function(e) {
            res.status(500).send();
        });
    }, function(e) {
        res.status(404).json(e);
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
