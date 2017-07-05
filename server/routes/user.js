var _ = require('underscore');
var models = require('../db.js');
var cryptojs = require('crypto-js');
var email = require('./email');
const moment = require('moment')

// GET /api/v1/users
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    var include = [];

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

    if (query.hasOwnProperty('waiting_list') && query.waiting_list.length > 0) {
        where.type = {
            $not: 'admin'
        };
        include = [{
            attributes: ['id'],
            model: models.owners
        }, {
            attributes: ['id'],
            model: models.customers
        }];
    }

    if (query.hasOwnProperty('owner_list') && query.owner_list.length > 0) {
        include = [{
            attributes: ['id'],
            model: models.owners
        }];
    }

    models.users.findAll({
        attributes: ['id', 'email', 'confirmed_email', 'type'],
        where: where,
        include: include
    }).then(function(users) {
        if (query.hasOwnProperty('waiting_list') && query.waiting_list.length > 0) {
            var filteredUsers = _.where(users, {owner: null, customer: null});
            res.json(filteredUsers);
        } else if (query.hasOwnProperty('owner_list') && query.owner_list.length > 0) {
            var filteredOwners = _.where(users, {owner: null});
            res.json(filteredOwners);
        } else {
            res.json(users);
        }
    }, function(e) {
        res.status(500).send();
    });
};

// GET /api/v1/users/:id
exports.view = function(req, res) {
    var userID = parseInt(req.params.id, 10);
    models.users.findById(userID).then(function(user) {
        if (user === null) {
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
    var body = _.pick(req.body, 'email', 'password', 'type', 'id');
    body.email = body.email.toLowerCase();
    models.users.create(body).then(function(user) {
        if (body.type === "customer") {
            var data = {
                name: 'Customer',
                email: user.email,
                password: body.password
            }
            res.json(user);
            data.trial_start_date = moment().format('MMMM DD, YYYY')
            data.trial_end_date = moment().add(30, 'd').format('MMMM DD, YYYY')
            data.trial_length = 30
            email.sendCustomerWelcomeEmail(data, res);
        } else if (body.type === "owner") {
            var data = {
                name: 'Restaurant Owner',
                email: user.email,
                password: body.password
            }
            res.json(user);
            email.sendOwnerWelcomeEmail(data, res);
        } else {
            res.json(user);
        }
    }, function(e) {
        res.status(400).json(e);
    });
};

// POST /api/v1/users/login
exports.login = function(req, res) {
    var body = _.pick(req.body, 'email', 'password');
    body.email = body.email.toLowerCase();
    var userInstance;
    models.users.authenticate(body).then(function(user) {
        var token = user.generateToken('authentication');
        userInstance = user;
        return models.tokens.create({
            token: token
        });
    }).then(function(tokenInstance) {
        var token = tokenInstance.get('token');
        models.users.findById(userInstance.id).then(function(user) {
            var userDetails = _.pick(user.toPublicJSON(token), 'type', 'id');
            var userSend = {};
            userSend.token = token;
            if (userDetails.type === 'customer') {
                models.customers.findAll({
                    where: {
                        user_id: userDetails.id
                    },
                    attributes: ['payment_plan_id', 'id', 'user_id'],
                }).then(function(customer) {
                    models.orders.findOne({where: {
                        status: 'active',
                        customer_id: customer[0].id
                    }})
                    .then(order => {
                        if (order) {
                            const today = moment().format('YYYY-MM-DD')
                            //moment rounds down when date has T00:00:00.000Z
                            //e.g 2017-07-05T00:00:00.000Z with moment === 2017-07-04
                            const tomorrowOrderDate = moment(order.order_date).add(2, 'd').format('YYYY-MM-DD')

                            console.log('order', order.toJSON())
                            console.log('today', today)
                            console.log('tomorrowOrderDate', tomorrowOrderDate)

                            if (tomorrowOrderDate === today) {
                                userSend.needOrderFeedback = order.toJSON().id
                            }
                        }
                        userSend.user_id = customer[0].user_id;
                        userSend.customer_id = customer[0].id;
                        userSend.type = "customer";
                        res.header('Auth', token).json(userSend);
                    }, function(e) {
                        res.status(500).send()
                    })
                });
            } else if (userDetails.type === 'owner') {
                models.owners.findOne({
                    attributes: ['id', 'user_id', 'status'],
                    where: {
                        user_id: userDetails.id
                    },
                    include: [{
                        attributes: ['id'],
                        model: models.restaurants
                    }]
                }).then(function(owner) {
                    userSend.type = "owner";
                    userSend.user_id = owner.user_id;
                    userSend.owner_id = owner.id;
                    userSend.restaurant_id = owner.restaurant.id;
                    userSend.status = owner.status
                    res.header('Auth', token).json(userSend);
                }, function(e) {
                    res.status(500).send();
                });
            } else if (userDetails.type === 'admin') {
                userSend.user_id = userInstance.id;
                userSend.type = "admin";

                res.header('Auth', token).json(userSend);
            }
        });
    }).catch(function() {
        res.status(401).send();
    });

};

// PUT /api/v1/user/:id
exports.update = function(req, res) {
    var userID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'email', 'password', 'confirmed_email', 'type', 'user_reset');
    var attributes = {};

    if (body.hasOwnProperty('email')) {
        body.email = body.email.toLowerCase();
        attributes.email = body.email;
    }

    if (body.hasOwnProperty('password')) {
        attributes.password = body.password;
    }

    if (body.hasOwnProperty('confirmed_email')) {
        attributes.confirmed_email = body.confirmed_email;
    }

    if (body.hasOwnProperty('type')) {
        attributes.type = body.type
    }

    models.users.findById(userID).then(function(user) {
        if (user) {
            user.update(attributes).then(function(user) {
                res.json(user.toPublicJSON());

                if (body.user_reset) {
                    const emailData = {
                        email: user.toJSON().email,
                        password: body.password
                    }

                    email.sendPasswordResetEmail(emailData, res)
                }
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

// POST /api/v1/user/authenticate
exports.authenticate = function(req, res) {
    const body = _.pick(req.body, 'id', 'password');
    const userId = parseInt(body.id, 10)

    models.users.findById(userId).then(function(user) {
        const authenticateData = {
            email: user.email,
            password: body.password.old_password
        }

        models.users.authenticate(authenticateData).then(function(authenticatedUser) {
            if (authenticatedUser) {
                user.update({ password: body.password.new_password }).then(function(user) {
                    res.json(user.toPublicJSON())
                })
            } else {
                res.status(500).send()
            }
        })
        .catch(function() {
            res.status(404).json({
                error: 'Sorry, incorrect password'
            });
        });
    }, function(e) {
        res.status(400).json(e)
    })
}

exports.forgotPassword = function(req, res) {
    const body = _.pick(req.body, 'email', 'password')
    const where = {}
    const updateAttributes = {}

    if (body.hasOwnProperty('email')) {
        where.email = body.email
    }

    if (body.hasOwnProperty('password')) {
        updateAttributes.password = body.password
    }

    models.users.findOne({
        where: where
    }).then(user => {
        if (user) {
            user.update(updateAttributes).then(updatedUser => {
                res.json(updatedUser.toPublicJSON())
                updateAttributes.email = body.email
                email.sendPasswordResetEmail(updateAttributes, res)
            })
        } else {
            res.status(500).send()
        }
    })
    .catch(() => {
        res.status(404).json({error: 'Invalid email'})
    }, function(e) {
        res.status(400).json(e)
    })
}