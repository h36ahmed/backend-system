var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/offers
exports.list = function (req, res) {
    var query = req.query;
    var where = {};
    var ordersWhere = {};

    var include = [{
        attributes: ['id', 'name', 'meal_image', 'description', 'tagline', 'ingredients'],
        model: models.meals,
        include: [{
            model: models.restaurants,
            attributes: ['id', 'name', 'longitude', 'latitude', 'street_address']
            }]
        }];

    if (query.hasOwnProperty('offer_date') && query.offer_date.length > 0) {
        where.offer_date = query.offer_date;
    }

    if (query.hasOwnProperty('from') && query.hasOwnProperty('to')) {
        where.offer_date = {
            $gte: query.from,
            $lte: query.to
        }
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
            order: [['pickup_time']],
            include: [{
                model: models.customers,
                attributes: ['first_name', 'last_name']
            }, {
                model: models.pickup_times,
                attributes: ['pickup_time']
            }]
        });
    }

    models.offers.findAll({
        where: where,
        include: include
    }).then(function (offers) {
        res.json(offers);
    }, function (e) {
        res.status(500).send();
    });
};

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

// UPDATE /api/v1/offer/:id
exports.update = (req, res) => {
    const offerId = parseInt(req.params.id, 10)
    const attributesToUpdate = {}
    console.log(req.body)
    // models.offers.findById(offerId)
    //     .then(offer => {
    //         if (offer) {

    //             switch(req.body.type) {
    //                 case 'ordered':
    //                     if (offer.dataValues.hasOwnProperty('plates_left') && offer.dataValues.plates_left > 0) {
    //                         attributesToUpdate.plates_left = offer.dataValues.plates_left - 1
    //                     }
    //                     break
    //                 case 'cancelled':
    //                     if (offer.dataValues.hasOwnProperty('plates_left')) {
    //                         attributesToUpdate.plates_left = offer.dataValues.plates_left + 1
    //                     }
    //                     break
    //                 default:
    //                     break
    //             }

    //             offer.update(attributesToUpdate)
    //                 .then(offer => {
    //                     res.json(offer)
    //                 }, e => {
    //                     res.status(400).json(e)
    //                 })
    //         } else {
    //             res.status(404).send()
    //         }
    //     }, () => {
    //         res.status(500).send()
    //     })
}