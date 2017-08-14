const _ = require('underscore');
const postmark = require("postmark");
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const models = require('./db.js');
const moment = require('moment');

//Your api key
const api_key = '32b29fd6-338e-49a4-98be-25a4c21458d3';
const from_who = 'admin@lunchsociety.ca'
const client = new postmark.Client(api_key);

const templatesDir = path.resolve(__dirname, '.', 'email-templates');

const template = new EmailTemplate(path.join(templatesDir, 'restaurant-orders'));

if (!template) {
  return cb({
    msg: 'Template not found',
    status: 500
  });
}

const yesterday = moment().subtract(1, 'd').format('YYYY-MM-DD')

models.restaurants.findAll({
  attributes: ['id', 'name'],
  include: [{
    attributes: ['name', 'id'],
    model: models.meals,
    include: [{
      attributes: ['id', 'offer_date'],
      model: models.offers,
      include: [{
        model: models.orders,
        where: { order_date: yesterday },
        order: [
          ['pickup_time']
        ],
        include: [{
          model: models.customers,
          attributes: ['first_name', 'last_name']
        }, {
          model: models.pickup_times,
          attributes: ['pickup_time']
        }]
      }]
    }]
  }, {
    attributes: ['first_name', 'last_name', 'phone_number'],
    model: models.owners,
    include: [{
      model: models.users,
      attributes: ['email']
    }]
  }]
}).then((restaurants) => {

  Promise.all(_.map(restaurants, (restaurant) => {
    return template.render(restaurant.toJSON())
      .then((results) => {
        const today = moment().format('MMMM DD, YYYY')
        return {
          From: from_who,
          To: restaurant.owner.user.email,
          Cc: from_who,
          Subject: `LUNCH SOCIETY: Orders for: ${today}`,
          HtmlBody: results.html,
          TextBody: results.text
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }))
  .then((messages) => {
    client.sendEmailBatch(messages, (err, batchResults) => {
      // Throwing inside a promise will just reject the promise
      // not stop your server
      if (err) throw err
      console.info('Messages sent to postmark');
    });
  });
}, e => {
  res.status(500).json(e);
});