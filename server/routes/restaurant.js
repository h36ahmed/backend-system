var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/restaurants
exports.list = function(req, res) {
    models.restaurants.findAll({
        attributes: ['id', 'name', 'street_address', 'city', 'state', 'country', 'postal_code', 'phone_number', 'logo', 'visible', 'owner_id'],
        include: [{
            attributes: ['name', 'id', 'price', 'meal_image'],
            model: models.meals
        }, {
            attributes: ['first_name', 'last_name'],
            model: models.owners
        }]
    }).then(function(restaurant) {
        res.json(restaurant);
    }, function(e) {
        res.status(500).json(e);
    });
};

// GET /api/v1/restaurant/:id
exports.view = function(req, res) {
    var restaurantID = parseInt(req.params.id, 10);
    models.restaurants.findById(restaurantID, {
        include: [{
            attributes: ['name', 'id', 'price', 'meal_image'],
            model: models.meals
        }]
    }).then(function(restaurant) {
        res.json(restaurant.toJSON());
    }, function(e) {
        res.status(404).json(e);
    });
};

// POST /api/v1/restaurant
exports.create = function(req, res) {
    var restaurantDetails = _.pick(req.body, 'name', 'street_address', 'city', 'state', 'country', 'postal_code', 'phone_number', 'logo', 'visible', 'owner_id');
    models.restaurants.create(restaurantDetails).then(function(restaurant) {
        res.json(restaurant.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/restaurant/:id
exports.delete = function(req, res) {
    var restaurantID = parseInt(req.params.id, 10);
    models.restaurants.destroy({
        where: {
            id: restaurantID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No restaurant found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
