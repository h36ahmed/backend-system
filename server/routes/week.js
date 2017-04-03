var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/week/:id
exports.view = function(req, res) {
    var weekID = parseInt(req.week.id, 10);
    models.weeks.findById(weekID).then(function(week) {
        var weekDetails = week.toJSON();
        models.restaurants.findAll({
            where: where,
            attributes: ['name', 'price'],
            include: [{
                model: models.meals,
                attributes: ['name', 'price'],
                include: [{
                    model: models.offers,
                    attributes: ['plates_assigned', 'plates_left'],
                    where: {
                        offer_date: {
                            $gt: weekDetails.from_date,
                            $lte: weekDetails.to_date
                        }
                    }
                }]
            }]
        }).then(function(restuarants) {
            res.json(restuarants);
        }, function(e) {
            res.status(500).send();
        });
    }, function(e) {
        res.status(404).json(e);
    });

};
