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
            attributes: ['first_name', 'last_name', 'phone_number'],
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
        }, {
            attributes: ['first_name', 'last_name', 'phone_number'],
            model: models.owners
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

// PUT /api/v1/restaurant/:id
exports.update = function(req, res) {
    var restaurantID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'name', 'street_address', 'city', 'state', 'country', 'postal_code', 'phone_number', 'logo', 'visible', 'owner_id');
    var attributes = {};

    if (body.hasOwnProperty('name')) {
        attributes.name = body.name;
    }

    if (body.hasOwnProperty('street_address')) {
        attributes.street_address = body.street_address;
    }

    if (body.hasOwnProperty('city')) {
        attributes.city = body.city;
    }

    if (body.hasOwnProperty('state')) {
        attributes.state = body.state;
    }

    if (body.hasOwnProperty('country')) {
        attributes.country = body.country;
    }

    if (body.hasOwnProperty('postal_code')) {
        attributes.postal_code = body.postal_code;
    }

    if (body.hasOwnProperty('phone_number')) {
        attributes.phone_number = body.phone_number;
    }

    if (body.hasOwnProperty('logo')) {
        attributes.logo = body.logo;
    }

    if (body.hasOwnProperty('visible')) {
        attributes.visible = body.visible;
    }

    models.restaurants.findById(restaurantID).then(function(restaurant) {
        if (restaurant) {
            restaurant.update(attributes).then(function(restaurant) {
                res.json(restaurant);
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
