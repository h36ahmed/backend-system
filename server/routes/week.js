var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/weeks
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.weeks.findAll({
        where: where
    }).then(function(weeks) {
        res.json(weeks);
    }, function(e) {
        res.status(500).send();
    });
};

// GET /api/v1/week/:id
exports.view = function(req, res) {
    var weekID = parseInt(req.params.id, 10);
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
            res.json(payouts);
        }, function(e) {
            res.status(500).send();
        });
    }, function(e) {
        res.status(404).json(e);
    });
};
