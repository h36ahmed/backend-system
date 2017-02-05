var _ = require('underscore');
var models = require('../db.js');
var cryptojs = require('crypto-js');

// GET /api/v1/users
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    // QUERY PARAMETERS

    // email -> Email
    if (query.hasOwnProperty('email') && query.email.length > 0) {
        where.email = {
            $like: '%' + query.email + '%'
        };
    }

    // type -> Type
    if (query.hasOwnProperty('type') && query.type.length > 0) {
        where.type = {
            $like: '%' + query.type + '%'
        };
    }

    // confirmed_email -> Confirmed Email?
    if (query.hasOwnProperty('confirmed_email') && query.confirmed_email.length > 0) {
        where.confirmed_email = {
            $like: '%' + query.confirmed_email + '%'
        };
    }

    models.users.findAll({
        attributes: ['id', 'email', 'confirmed_email', 'type'],
        where: where
    }).then(function(users) {
        res.json(users);
    }, function(e) {
        res.status(500).send();
    });
};

// GET /api/v1/users/:id
exports.view = function(req, res) {
    var userID = parseInt(req.params.id, 10);
    models.users.findById(userID).then(function(user) {
        if (user == null) {
            res.status(404);
        } else {
            res.json(user.toPublicJSON());
        }
    }, function(e) {
        res.status(404).json(e);
    });
};

// POST /api/v1/user
exports.create = function(req, res) {
    var body = _.pick(req.body, 'email', 'password', 'type');

    models.users.create(body).then(function(user) {
        res.json(user.toPublicJSON());
    }, function(e) {
        res.status(400).json(e);
    });
};

// POST /api/v1/users/login
exports.login = function(req, res) {
    var body = _.pick(req.body, 'email', 'password');
    var userInstance;
    models.users.authenticate(body).then(function(user) {
        var token = user.generateToken('authentication');
        userInstance = user;
        return models.tokens.create({
            token: token
        });

    }).then(function(tokenInstance) {
        var token = tokenInstance.get('token');
        res.header('Auth', token).json(userInstance.toPublicJSON(token));
    }).catch(function() {
        res.status(401).send();
    });

};

// PUT /api/v1/user/:id
exports.update = function(req, res) {
    var userID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'email', 'password', 'confirmed_email');
    var attributes = {};

    if (body.hasOwnProperty('email')) {
        attributes.email = body.email;
    }

    if (body.hasOwnProperty('password')) {
        attributes.password = body.password;
    }

    if (body.hasOwnProperty('confirmed_email')) {
        attributes.confirmed_email = body.confirmed_email;
    }

  models.users.findById(userID).then(function(user) {
        if (user) {
            user.update(attributes).then(function(user) {
                res.json(user.toPublicJSON());
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

// DELETE /api/v1/user/:id
exports.delete = function(req, res) {
    var userID = parseInt(req.params.id, 10);
    models.users.destroy({
        where: {
            id: userID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No user found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};

// DELETE /api/v1/users/login
exports.logout = function(req, res) {
    req.token.destroy({
        force: true
    }).then(function() {
        res.status(204).send();
    }).catch(function() {
        res.status(500).send();
    });
};
