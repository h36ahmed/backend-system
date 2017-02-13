var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/feedbacks
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.feedbacks.findAll({
        where: where,
        include: [{
            attributes: ['order_date', 'id'],
            model: models.orders,
            include: [{
                model: models.customers,
                attributes: ['id', 'first_name', 'last_name'],
                include: [{
                    model: models.users,
                    attributes: ['email']
                }]
            }, {
                model: models.offers,
                attributes: ['id'],
                include: [{
                    model: models.meals,
                    attributes: ['id','name'],
                    include: [{
                        model: models.restaurants,
                        attributes: ['id', 'name']
                    }]
                }]
            }]
        }]
    }).then(function(feedbacks) {
        res.json(feedbacks);
    }, function(e) {
        res.status(500).send();
    });
};

// POST /api/v1/feedback
exports.create = function(req, res) {
    var feedbackDetails = _.pick(req.body, 'comments', 'flavour', 'portion_size', 'overall', 'order_id');
    models.feedbacks.create(feedbackDetails).then(function(feedback) {
        res.json(feedback);
    }, function(e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/feedback/:id
exports.delete = function(req, res) {
    var feedbackID = parseInt(req.params.id, 10);
    models.feedbacks.destroy({
        where: {
            id: feedbackID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No feedback found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
