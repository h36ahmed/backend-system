var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/orders
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    // QUERY PARAMETERS

    if (query.hasOwnProperty('order_date') && query.order_date.length > 0) {
        where.order_date =  query.order_date;
    }

    if (query.hasOwnProperty('status') && query.status.length > 0) {
        where.status =  query.status;
    }

    /*models.orders.findAll({
        include: [{
            model: models.meals,
            attributes: ['name', 'ingredients'],
            include: [{
                model: models.restaurants,
                attributes: ['name'],

            }]
        }]
    }).then(function(orders) {
        res.json(orders);
    }, function(e) {
        res.status(500).send();
    });
*/
};

// POST /api/v1/order
exports.create = function(req, res) {
    var orderDetails = _.pick(req.body, 'order_date', 'pickup_time_id', 'offer_id', 'customer_id');
    models.orders.create(orderDetails).then(function(order) {
        res.json(order);
    }, function(e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/order/:id
exports.delete = function(req, res) {
    var orderID = parseInt(req.params.id, 10);
    models.orders.destroy({
        where: {
            id: orderID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No order found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
