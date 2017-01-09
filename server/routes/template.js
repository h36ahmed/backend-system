/*
var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/[items]
exports.list = function(req, res){
    var query = req.query;
    var where = {};

    // QUERY PARAMETERS

    // [codename] -> [Table Attribute]
    if (query.hasOwnProperty('email') && query.email.length > 0) {
        where.email = {
            $like: '%' + query.email + '%'
        };
    }

    models.users.findAll({
        attributes: [],
        where: where
    }).then(function (users) {
        res.json(users);
    }, function(e) {
        res.status(500).send();
    });
};

// POST /api/v1/[item]
exports.create = function(req, res){
    var body = _.pick(req.body,'email','password','type');

     models.users.create(body).then(function(user){
         res.json(user.toPublicJSON());
     }, function(e){
         res.status(400).json(e);
     });
};


// PUT /api/v1/[item]/:id
exports.update = function (req, res) {
    var userID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'email', 'password', 'first_name', 'last_name');

    var attributes = {};

    if (body.hasOwnProperty('email')) {
        attributes.email = body.email;
    }

    if (body.hasOwnProperty('password')) {
        attributes.password = body.password;
    }

    if (body.hasOwnProperty('first_name')) {
        attributes.first_name = body.first_name;
    }

    if (body.hasOwnProperty('last_name')) {
        attributes.last_name = body.last_name;
    }

    models.users.findById(userID).then(function (user) {
        if (user) {
            user.update(attributes).then(function (user) {
                res.json(user.toPublicJSON());
            }, function (e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
};

// DELETE /api/v1/[item]/:id
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
    }, function () {
        res.status(500).send();
    });
};
*/
