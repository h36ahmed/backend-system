var _ = require('underscore');
var models = require('../db.js');
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyD36yXcN829WP0wpCdiSiY_ZQ9VBlJK6iM',
};

var geocoder = NodeGeocoder(options);

// GET /api/v1/restaurants
exports.list = function(req, res) {
    const where = {}

    if (req.query.hasOwnProperty('status') && req.query.status.length > 0) {
        where.status = req.query.status
    }

    models.restaurants.findAll({
        where: where,
        include: [{
            attributes: ['name', 'id', 'price', 'meal_image', 'ingredients'],
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
    var restaurantDetails = _.pick(req.body, 'name', 'street_address', 'city', 'state', 'country', 'postal_code', 'phone_number', 'logo', 'status', 'owner_id', 'payout_rate');

    geocoder.geocode({
        address: restaurantDetails.street_address,
        postal_code: restaurantDetails.postal_code,
        city: restaurantDetails.city,
        country: restaurantDetails.country
    }, function(err, body) {
        if (err) {
            res.status(500).send();
        }
        restaurantDetails.latitude = body[0].latitude;
        restaurantDetails.longitude = body[0].longitude;
        models.restaurants.create(restaurantDetails).then(function(restaurant) {
            res.json(restaurant.toJSON());
        }, function(e) {
            res.status(400).json(e);
        });
    });

};

// PUT /api/v1/restaurant/:id
exports.update = function(req, res) {
    var restaurantID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'name', 'street_address', 'city', 'state', 'country', 'postal_code', 'phone_number', 'logo', 'status', 'owner_id', 'payout_rate', 'longitude', 'latitude');
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

    if (body.hasOwnProperty('status')) {
        attributes.status = body.status;
        if(attributes.status) {
            attributes.status = 'active';
        } else {
            attributes.status = 'inactive';
        }
    }

    if (body.hasOwnProperty('payout_rate')) {
        attributes.payout_rate = body.payout_rate;
    }

    if (body.hasOwnProperty('owner_id')) {
        attributes.owner_id = parseInt(body.owner_id, 10);
    }
    geocoder.geocode({
        address: attributes.street_address,
        postal_code: attributes.postal_code,
        city: attributes.city,
        country: attributes.country
    }, function(err, body) {
        if (err) {
            res.status(500).send();
        }
        attributes.latitude = body[0].latitude;
        attributes.longitude = body[0].longitude;
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
