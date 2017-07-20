const models = require('./db.js');
const moment = require('moment')
const tomorrow = moment().add(1, 'd').format('YYYY-MM-DD')

models.restaurants.findAll()
.then(restaurants => {
  restaurants.forEach(restaurant => {
    const id = restaurant.toJSON().id

    // Checks all offers for tomorrow for the restaurant
    models.offers.findAll({
      where: { offer_date: tomorrow },
      include: [{
        model: models.meals,
        include: [{
          model: models.restaurants,
          where: { id }
        }]
      }]
    })
    .then(offers => {
      // If there are no offeres for that restaurant then find the default meal and make an offer off it
      if (offers.length === 0) {
        models.meals.findOne({
          where: { default_meal: true },
          include: [{
            model: models.restaurants,
            where: { id }
          }]
        })
        .then(meal => {
          const restaurantDefaultMealId = meal.toJSON().id

          models.offers.create({
            offer_date: tomorrow,
            plates_assigned: 20,
            plates_left: 20,
            status: 'active',
            meal_id: restaurantDefaultMealId
          })
        })
      }
    })
  })
})

