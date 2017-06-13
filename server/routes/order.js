var _ = require('underscore');
var models = require('../db.js');
const email = require('./email')
const payment = require('./payment.js')
const ics = require('../ics-generator.js')

const formatShortDate = (date) => {
  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  const splitDate = date.indexOf('T') === -1 ? date.split('-') : date.split('T')[0].split('-')
  const day = splitDate[2]
  const month = monthNames[parseInt(splitDate[1], 10) - 1]
  const year = splitDate[0]

  return `${month} ${day}, ${year}`
}

// GET /api/v1/orders
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    // QUERY PARAMETERS

    if (query.hasOwnProperty('order_date') && query.order_date.length > 0) {
        where.order_date =  query.order_date;
    }

    if (query.hasOwnProperty('customer_id') && query.customer_id.length > 0) {
        where.customer_id =  query.customer_id;
    }

    models.orders.findAll({
        where: where,
        order: [['id', 'DESC']],
        include: [{
            model: models.offers,
            include: [{
                model: models.meals,
                attributes: ['name', 'ingredients'],
                include: [{
                    model: models.restaurants,
                    attributes: ['name'],
                }],
            }]
        }, {
            model: models.pickup_times,
        }, {
            model: models.customers
        }, {
            model: models.feedbacks
        }]
    }).then(function(orders) {

        res.json(orders);
    }, function(e) {
        res.status(500).send();
    });
};

// GET /api/v1/orders/:id
exports.view = function(req, res) {
    const orderId = parseInt(req.params.id, 10)

    models.orders.findById(orderId, {
        include: [{
            model: models.pickup_times,
            attributes: ['pickup_time']
        }, {
            model: models.offers,
            include: [{
                model: models.meals,
                attributes: ['name', 'description', 'ingredients'],
                include: [{
                    model: models.restaurants,
                    attributes: ['name', 'street_address', 'city', 'state', 'country', 'postal_code', 'longitude', 'latitude'],
                }]
            }]
        }, {
          model: models.customers,
          include: [{
            model: models.users,
            attributes: ['email'],
          }]
        }]
    })
    .then(function(order) {
        res.json(order);
    }, function(e) {
        res.status(400).json(e);
    })
}

// POST /api/v1/order
exports.create = function(req, res) {
    var orderDetails = _.pick(req.body, 'order_date', 'pickup_time_id', 'offer_id', 'customer_id', 'status');
    const emailData = {}
    models.orders.create(orderDetails)
      .then(order => {
        emailData.date = formatShortDate(order.order_date)
        emailData.ICSDate = order.order_date.split('T')[0]
        // emailData.ICSDate = order.order_date

        models.offers.findById(order.offer_id, {
          include: [{
            model: models.meals,
            attributes: ['name'],
            include: [{
              model: models.restaurants,
              attributes: ['name', 'street_address', 'city', 'state', 'country', 'postal_code', 'longitude', 'latitude']
            }]
          }]
        })
          .then(offer => {
            emailData.meal = { name: offer.meal.name }
            emailData.restaurant = {
              name: offer.meal.restaurant.name,
              street_address: offer.meal.restaurant.street_address,
              city: offer.meal.restaurant.city,
              postal_code: offer.meal.restaurant.postal_code,
              longitude: offer.meal.restaurant.longitude,
              latitude: offer.meal.restaurant.latitude
            }

            models.offers.update({ 'plates_left': offer.plates_left - 1 }, {
              where: { id: order.offer_id }
            })
            .then(() => {
              models.customers.findById(order.customer_id, {
                include: [{
                  model: models.users,
                  attributes: ['email']
                }]
              })
                .then(customer => {
                  emailData.name = customer.first_name
                  emailData.email = customer.user.email
                  emailData.last_name = customer.last_name

                  models.customers.update({ 'meals_remaining': customer.meals_remaining - 1 }, {
                    where: { id: customer.id }
                  })
                  .then(() => {
                    // if (customer.meals_remaining - 1 === 0 && customer.payment_plan_id === 3) {
                    //   payment.updateSubscription(customer.id, res)
                    // }
                    models.pickup_times.findById(order.pickup_time_id)
                      .then(pickup_time => {
                        emailData.pick_up_time = pickup_time.pickup_time
                        // email.sendOrderEmail(emailData, res)
                        ics.generateICS(emailData)
                        res.json(emailData)
                      })
                  })
                })
              })
            })
          })
    }, function(e) {
        res.status(400).json(e);
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

// UPDATE /api/v1/order/:id
exports.update = (req, res) => {
  const orderId = parseInt(req.params.id, 10)
  const attributesToUpdate = {}
  const emailData = {}

  models.orders.findById(orderId)
    .then(order => {
      if (order) {

        if (order.dataValues.hasOwnProperty('status') && order.dataValues.status !== 'cancelled') {
          attributesToUpdate.status = 'cancelled'
        }

        order.update(attributesToUpdate)
          .then(order => {
          emailData.date = formatShortDate(order.order_date)
            models.offers.findById(order.offer_id)
              .then(offer => {
                if (attributesToUpdate.status === 'cancelled') {
                  attributesToUpdate.plates_left = offer.dataValues.plates_left + 1
                }

                models.offers.update({"plates_left": attributesToUpdate.plates_left}, {
                  where: { id: order.offer_id }
                })
                .then(() => {
                  models.meals.findById(offer.meal_id)
                    .then(meal => {
                    emailData.meal = { name: meal.name }

                    models.restaurants.findById(meal.restaurant_id)
                      .then(restaurant => {
                        emailData.restaurant = {
                          name: restaurant.name,
                          street_address: restaurant.street_address,
                          city: restaurant.city
                        }

                        models.customers.findById(order.dataValues.customer_id)
                          .then(customer => {
                            emailData.name = customer.first_name

                            if (attributesToUpdate.status === 'cancelled') {
                              attributesToUpdate.meals_remaining = customer.dataValues.meals_remaining + 1
                            }

                              models.customers.update({"meals_remaining": attributesToUpdate.meals_remaining}, {
                                where: { id: order.dataValues.customer_id }
                              })
                              .then(() => {
                                models.users.findById(customer.user_id)
                                  .then(user => {
                                    emailData.email = user.dataValues.email

                                    models.pickup_times.findById(order.pickup_time_id)
                                      .then(pickup_time => {
                                        emailData.pick_up_time = pickup_time.pickup_time
                                        if (attributesToUpdate.status === 'cancelled') {
                                          // email.sendCOEmail(emailData, res)
                                        }
                                      })
                                  }, e => {
                                    res.status(400).json(e)
                                  })
                              })
                          })
                      })
                    })
                  })
              })
            })
      } else {
        res.status(404).send()
      }
    }, () => {
      res.status(500).send()
  })
}