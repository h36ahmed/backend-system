var _ = require('underscore');
var models = require('../db.js');


// GET /api/v1/owners
exports.list = function(req, res) {
    var query = req.query;
    var where = {};
    var userWhere = {};

    var include = [{
        model: models.users,
        attributes: ['email', 'confirmed_email'],
        where: userWhere
    }];

    // QUERY PARAMETERS

    // fn -> First Name
    if (query.hasOwnProperty('first_name') && query.first_name.length > 0) {
        where.first_name = {
            $like: '%' + query.fn + '%'
        };
    }

    // ln -> Last Name
    if (query.hasOwnProperty('last_name') && query.last_name.length > 0) {
        where.last_name = {
            $like: '%' + query.ln + '%'
        };
    }

    // date_joined -> Date Joined
    if (query.hasOwnProperty('date_joined') && query.date_joined.length > 0) {
        where.date_joined = {
            $like: '%' + query.date_joined + '%'
        };
    }

    // email -> Email
    if (query.hasOwnProperty('email') && query.email.length > 0) {
        userWhere.email = {
            $like: '%' + query.email + '%'
        };
    }
    // type -> Type
    if (query.hasOwnProperty('type') && query.type.length > 0) {
        userWhere.type = {
            $like: '%' + query.type + '%'
        };
    }

    if (query.hasOwnProperty('no_restaurant_list') && query.no_restaurant_list.length > 0) {
        include.push({
            attributes: ['id'],
            model: models.restaurants
        });
    }

    models.owners.findAll({
        where: where,
        include: include
    }).then(function(owners) {
         if (query.hasOwnProperty('no_restaurant_list') && query.no_restaurant_list.length > 0) {
            var filteredOwners = _.where(owners, { restaurant: null});
            res.json(filteredOwners);
        } else {
            res.json(owners);
        }

    }, function(e) {
        res.status(500).send();
    });
};

// GET /api/v1/owners/:id
exports.view = function(req, res) {
    var ownerID = parseInt(req.params.id, 10);
    // When presenting a list option make option value user id and display value emails.
    models.owners.findById(ownerID, {
        include: [{
            attributes: ['name', 'id', 'phone_number', 'logo', 'street_address', 'city', 'state', 'country', 'postal_code'],
            model: models.restaurants
        }, {
            attributes: ['email', 'confirmed_email'],
            model: models.users
        }]
    }).then(function(owner) {
        res.json(owner);
    }, function(e) {
        res.status(404).json(e);
    });
};

// POST /api/v1/owner
exports.create = function(req, res) {
    var ownerDetails = _.pick(req.body, 'first_name', 'last_name', 'phone_number', 'date_joined', 'profile_image', 'user_id');
    models.owners.create(ownerDetails).then(function(owner) {
        res.json(owner);
    }, function(e) {
        res.status(400).json(e);
    });
};

// PUT /api/v1/owner/:id
exports.update = function(req, res) {
    var ownerID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'first_name', 'last_name', 'phone_number', 'profile_image', 'user_id', 'status');

    var attributes = {};

    if (body.hasOwnProperty('first_name')) {
        attributes.first_name = body.first_name;
    }

    if (body.hasOwnProperty('last_name')) {
        attributes.last_name = body.last_name;
    }

    if (body.hasOwnProperty('phone_number')) {
        attributes.phone_number = body.phone_number;
    }

    if (body.hasOwnProperty('profile_image')) {
        attributes.profile_image = body.profile_image;
    }

    if (body.hasOwnProperty('user_id')) {
        attributes.user_id = parseInt(body.user_id, 10);
    }

    if (body.hasOwnProperty('status')) {
        attributes.status = parseInt(body.status, 10);
    }


    models.owners.findById(ownerID).then(function(owner) {
        if (owner) {
            owner.update(attributes).then(function(owner) {
                res.json(owner);
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

// DELETE /api/v1/owner/:id
exports.delete = function(req, res) {
    var ownerID = parseInt(req.params.id, 10);
    models.owners.findById(ownerID).then(function(owner) {
        if (owner) {
            var user_id = owner.user_id;
            models.owners.destroy({
                where: {
                    id: ownerID
                }
            }).then(function(rowsDeleted) {
                if (rowsDeleted === 0) {
                    res.status(404).json({
                        error: 'No owner found'
                    });
                } else {
                    models.users.destroy({
                        where: {
                            id: user_id
                        }
                    }).then(function(rowsDeleted) {
                        res.status(204).send();
                    }, function() {
                        res.status(500).send();
                    });
                }
            }, function() {
                res.status(500).send();
            });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    });
};
