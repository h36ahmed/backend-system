var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/offers
exports.list = function (req, res) {
    var query = req.query;
    var where = {};
    var ordersWhere = {};

    var include = [{
        attributes: ['id', 'name', 'meal_image', 'description', 'ingredients'],
        model: models.meals,
        include: [{
            model: models.restaurants,
            where: req.query.restaurant ? {id: parseInt(req.query.restaurant)} : {},
            attributes: ['id', 'name', 'longitude', 'latitude', 'street_address']
        }]
    }];

    if (query.hasOwnProperty('offer_date') && query.offer_date.length > 0) {
        where.offer_date = query.offer_date;
    }

    if (query.hasOwnProperty('order_date') && query.order_date.length > 0) {
        ordersWhere.order_date =  query.order_date;
    }

    if (query.hasOwnProperty('status') && query.status.length > 0) {
        ordersWhere.status =  query.status;
    }

    if (query.hasOwnProperty('getOrders') && query.getOrders.length > 0) {
        include.push({
            model: models.orders,
            where: ordersWhere,
            order: [['order_date', 'pickup_time_id']],
            include: [{
                model: models.customers,
                attributes: ['first_name', 'last_name']
            }, {
                model: models.pickup_times,
                attributes: ['pickup_time']
            }]
        });
    }

    if (query.hasOwnProperty('offer_status') && query.offer_status.length > 0) {
        where.status = query.offer_status
    }

    models.offers.findAll({
        where: where,
        include: include,
        order: [['id', 'DESC']]
    }).then(function (offers) {
        res.json(offers);
    }, function (e) {
        res.status(500).send();
    });
};

// GET /api/v1/offers/:id
exports.view = function (req, res) {
    const offerId = parseInt(req.params.id, 10)

    models.offers.findById(offerId)
        .then(offer => {
            res.json(offer)
        }, e => {
            res.status(500).send()
        })
}

// POST /api/v1/offer
exports.create = function (req, res) {
    var offerDetails = _.pick(req.body, 'meal_id', 'offer_date', 'plates_assigned', 'plates_left');
    models.offers.create(offerDetails).then(function (offer) {
        res.json(offer);
    }, function (e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/offer/:id
exports.delete = function (req, res) {
    var offerID = parseInt(req.params.id, 10);
    models.offers.destroy({
        where: {
            id: offerID
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No offer found'
            });
        } else {
            res.status(204).send();
        }
    }, function () {
        res.status(500).send();
    });
};

// GET /api/v1/offers-report
exports.offers = function (req, res) {
    var offerDetails = _.pick(req.query, 'week_id', 'restaurant_id');
    var weekID = parseInt(offerDetails.week_id, 10);
    var restaurantID = parseInt(offerDetails.restaurant_id, 10);
    var where = {};

    models.weeks.findById(weekID).then(function(week) {
        var weekDetails = week.toJSON();
        models.offers.findAll({
            where: {
                offer_date: {
                    $gte: weekDetails.from_date,
                    $lte: weekDetails.to_date
                }
            },
            order: [['offer_date', 'DESC']],
            include: [{
                attributes: ['id', 'name', 'ingredients'],
                model: models.meals,
                where: {
                    restaurant_id: restaurantID
                }
            }]
        }).then(function(offers) {
            res.json(offers)
        }, function(e) {
            res.status(500).send();
        });
    }, function(e) {
        res.status(404).json(e);
    });
};


// UPDATE /api/v1/offer/:id
exports.update = (req, res) => {
    const offerDetails = _.pick(req.body, 'meal_id', 'offer_date', 'plates_assigned', 'plates_left', 'status');
    const offerId = parseInt(req.params.id)
    const attributesToUpdate = {}

    if (offerDetails.meal_id) attributesToUpdate.meal_id = offerDetails.meal_id
    if (offerDetails.offer_date) attributesToUpdate.offer_date = offerDetails.offer_date
    if (offerDetails.plates_assigned) attributesToUpdate.plates_assigned = offerDetails.plates_assigned
    if (offerDetails.plates_left) attributesToUpdate.plates_left = offerDetails.plates_left
    if (offerDetails.status) attributesToUpdate.status = offerDetails.status

    models.offers.findById(offerId)
        .then(offer => {
            if (offer) {
                offer.update(attributesToUpdate)
                .then(offer => {
                    res.json(offer)
                }, e => {
                    res.status(400).json(e)
                })
            } else {
                res.status(404).send()
            }
        }, () => {
            res.status(500).send()
        })
}
