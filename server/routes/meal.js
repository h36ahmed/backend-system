var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/meals
exports.list = function(req, res){
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('restaurant_id') && query.restaurant_id.length > 0) {
        where.restaurant_id =  query.restaurant_id;
    }

    models.meals.findAll({
        attributes: ['id', 'name', 'description', 'tagline', 'ingredients', 'price', 'meal_image', 'restaurant_id'],
        where: where
    }).then(function (meals) {
        res.json(meals);
    }, function(e) {
        res.status(500).json(e);
    });
};

// GET /api/v1/meal/:id
exports.view = function (req, res) {
    var mealID = parseInt(req.params.id, 10);
    models.meals.findById(mealID).then(function (meal) {
        res.json(meal.toJSON());
    }, function (e) {
        res.status(404).json(e);
    });
};

// POST /api/v1/meal
exports.create = function(req, res){
    var body = _.pick(req.body, 'name', 'description', 'tagline', 'ingredients', 'price', 'meal_image', 'restaurant_id');

     models.meals.create(body).then(function(meal){
         res.json(meal.toJSON());
     }, function(e){
         res.status(400).json(e);
     });
};

// DELETE /api/v1/meal/:id
exports.delete = function(req, res) {
    var mealID = parseInt(req.params.id, 10);
    models.meals.destroy({
        where: {
			id: mealID
		}
      }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No meal found'
            });
        } else {
            res.status(204).send();
        }
    }, function () {
        res.status(500).send();
    });
};
