var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/offers
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.offers.findAll({
        where: where,
        include: [{
            attributes: ['name', 'meal_image'],
            model: models.meals,
            include: [{
                model: models.restaurants,
                attributes: ['name']
            }]
        }]
    }).then(function(offers) {
        res.json(offers);
    }, function(e) {
        res.status(500).send();
    });
};

// POST /api/v1/offer
exports.create = function(req, res) {
    var offerDetails = _.pick(req.body, 'meal_id', 'offer_date', 'plates_left');
    models.offers.create(offerDetails).then(function(offer) {
        res.json(offer);
    }, function(e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/offer/:id
exports.delete = function(req, res) {
    var offerID = parseInt(req.params.id, 10);
    models.offers.destroy({
        where: {
            id: offerID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No offer found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
