var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/meals
exports.list = function(req, res) {
    var query = req.query;
    var where = {};
    var restaurantWhere = {};
    let order = []

    if (query.hasOwnProperty('restaurant_id') && query.restaurant_id.length > 0) {
        where.restaurant_id = query.restaurant_id;
    }

    if (query.hasOwnProperty('changeDefaultMeal') && query.changeDefaultMeal) {
        order.push(['default_meal', 'DESC'])
    }

    models.meals.findAll({
        attributes: ['id', 'name', 'description', 'ingredients', 'price', 'meal_image', 'default_meal'],
        where: where,
        order: order,
        include: [{
            attributes: ['name', 'id'],
            model: models.restaurants,
            where: restaurantWhere
        }]
    }).then(function(meals) {
        res.json(meals);
    }, function(e) {
        console.log('e', e)
        res.status(500).json(e);
    });
};

// GET /api/v1/meal/:id
exports.view = function(req, res) {
    var mealID = parseInt(req.params.id, 10);
    models.meals.findById(mealID, {
        include: [{
            attributes: ['name', 'id'],
            model: models.restaurants
        }]
    }).then(function(meal) {
        res.json(meal.toJSON());
    }, function(e) {
        res.status(404).json(e);
    });
};

// POST /api/v1/meal
exports.create = function(req, res) {
    var body = _.pick(req.body, 'name', 'description', 'ingredients', 'price', 'meal_image', 'restaurant_id');

    models.meals.create(body).then(function(meal) {
        res.json(meal.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
};

// PUT /api/v1/meal/:id
exports.update = function(req, res) {
    var mealID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'name', 'description', 'ingredients', 'price', 'meal_image', 'restaurant_id', 'default_meal');

    var attributes = {};
    const where = {}
    const restaurantWhere = {}

    if (body.hasOwnProperty('name')) {
        attributes.name = body.name;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    if (body.hasOwnProperty('ingredients')) {
        attributes.ingredients = body.ingredients;
    }

    if (body.hasOwnProperty('price')) {
        attributes.price = body.price;
    }

    if (body.hasOwnProperty('meal_image')) {
        attributes.meal_image = body.meal_image;
    }

    if (body.hasOwnProperty('restaurant_id')) {
        attributes.restaurant_id = body.restaurant_id;
        where.restaurant_id = body.restaurant_id // 3
    }

    if (body.hasOwnProperty('default_meal')) {
        attributes.default_meal = body.default_meal
        where.default_meal = body.default_meal // true
    }

    if (body.hasOwnProperty('oldDefaultMealId')) {
        attributes.oldDefaultMealId = body.oldDefaultMealId
    }

    if (attributes.default_meal) {
        models.meals.findAll({
            where: where,
            include: [{
                attributes: ['name', 'id'],
                model: models.restaurants,
                where: restaurantWhere
            }]
        })
        .then(meal => {
            meal[0].update({ default_meal: false })
            .then(meal => {}, e => {
                res.status(400).json(e)
            })
        }, () => {
            res.status(500).send()
        })
    }
    models.meals.findById(mealID).then(function(meal) {
        if (meal) {
            meal.update(attributes).then(function(meal) {
                res.json(meal);
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
    }, function() {
        res.status(500).send();
    });
};
