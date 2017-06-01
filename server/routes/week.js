var _ = require('underscore');
var models = require('../db.js');

const formatNumberDate = (date) => {
    const splitDate = date.split('-');
    var month = '';
    switch(splitDate[1]) {
        case 'Jan':
            month = '01'
            break
        case 'Feb':
            month = '02'
            break
        case 'Mar':
            month = '03'
            break
        case 'Apr':
            month = '04'
            break
        case 'May':
            month = '05'
            break
        case 'Jun':
            month = '06'
            break
        case 'Jul':
            month = '07'
            break
        case 'Aug':
            month = '08'
            break
        case 'Sep':
            month = '09'
            break
        case 'Oct':
            month = '10'
            break
        case 'Nov':
            month = '11'
            break
        case 'Dec':
            month = '12'
            break
        default:
            break
    }

    return `20${splitDate[2]}-${month}-${splitDate[0]}`
}

// GET /api/v1/weeks
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    req.query.hasOwnProperty('id') ? where.id = req.query.id : null
    models.weeks.findAll({
        where: where
    }).then(function(weeks) {
        const weekDetails = weeks[0].toJSON()
        models.restaurants.findAll({
            // where: where,
            attributes: ['name'],
            include: [{
                model: models.meals,
                attributes: ['name', 'price'],
                include: [{
                    model: models.offers,
                    attributes: ['plates_assigned', 'plates_left', 'offer_date'],
                    where: {
                        offer_date: {
                            $gte: formatNumberDate(weekDetails.from_date),
                            $lte: formatNumberDate(weekDetails.to_date)
                        }
                    }
                }]
            }]
        })
        .then(restaurants => {

        res.json(restaurants);

        })
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
                            $gte: weekDetails.from_date,
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
