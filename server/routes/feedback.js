var _ = require('underscore');
var models = require('../db.js');
const email = require('./email')

// GET /api/v1/feedbacks
exports.list = function(req, res) {

    var query = req.query;
    var where = {};

    models.feedbacks.findAll({
        where: where,
        include: [{
            attributes: ['order_date', 'id', 'status'],
            model: models.orders,
            where: req.query.status ? { status: req.query.status } : {},
            include: [{
                model: models.customers,
                attributes: ['id', 'first_name', 'last_name'],
                include: [{
                    model: models.users,
                    attributes: ['id', 'email'],
                    where: req.query.user_id ? { id: req.query.user_id } : {},
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
    const feedbackDetails = _.pick(req.body, 'comments', 'flavour', 'portion_size', 'overall', 'order_id');
    models.feedbacks.create(feedbackDetails)
        .then(() => {
            models.orders.findById(feedbackDetails.order_id, {
                include: [{
                    model: models.customers,
                    attributes: ['first_name', 'last_name'],
                }]
            })
            .then(data => {
                feedbackDetails.customer_name = data.customer.first_name

                email.sendFeedbackEmail({ email: req.body.email, type: 'feedback', emailData: feedbackDetails })
                // email.sendFeedbackEmail({ email: 'Daniel@lunchsociety.ca', type: 'feedback', emailData: feedbackDetails })
                models.orders.update({ 'status': 'completed' }, {
                    where: { id: feedbackDetails.order_id }
                })
                res.json(data);
            }, function(e) {
                res.status(400).json(e)
            })
        })
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
