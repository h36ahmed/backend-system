var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/pickup-times
exports.list = function(req, res) {
    var query = req.query;
    models.pickup_times.findAll().then(function(pickup_times) {
        res.json(pickup_times);
    }, function(e) {
        res.status(500).send();
    });
};
