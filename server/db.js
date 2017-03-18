'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var db        = {};
var sequelize;

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        'dialect': 'postgres',
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-database.sqlite'
    });
}

fs
  .readdirSync(__dirname + '/models/')
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize.import(__dirname + '/models/' + file);
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);User.belongsTo(Company);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ASSOCIATIONS

// Users & Owners U:O -> 1:1
db.owners.belongsTo(db.users);
db.users.hasOne(db.owners);

// Users & Customers U:C -> 1:1
db.customers.belongsTo(db.users);
db.users.hasOne(db.customers);

// Restaurants & Owners R:O -> 1:1
db.restaurants.belongsTo(db.owners);
db.owners.hasOne(db.restaurants);

// Referral Codes & Users RC:U -> 1:1
db.referral_codes.belongsTo(db.users);
db.users.hasOne(db.referral_codes);

// Restaurants & Meals R:M -> 1:M
db.restaurants.hasMany(db.meals);
db.meals.belongsTo(db.restaurants);

// Payment Plans & Customers PP:C -> 1:M
db.payment_plans.hasMany(db.customers);
db.customers.belongsTo(db.payment_plans);

// Orders & Feedbacks O:F -> 1:M
db.orders.hasMany(db.feedbacks);
db.feedbacks.belongsTo(db.orders);

// Customers & Invoices C:I -> 1:M
db.customers.hasMany(db.invoices);
db.invoices.belongsTo(db.customers);

// Restaurants & Payouts R:P -> 1:M
db.restaurants.hasMany(db.payouts);
db.payouts.belongsTo(db.restaurants);

// Meals & Offers M:O -> 1:M
db.meals.hasMany(db.offers);
db.offers.belongsTo(db.meals);

// Offers & Orders Of:Or -> 1:M
db.offers.hasMany(db.orders);
db.orders.belongsTo(db.offers);

// Pickup Times & Orders Of:Or -> 1:M
db.pickup_times.hasMany(db.orders);
db.orders.belongsTo(db.pickup_times);

// Customers & Orders C:O -> 1:M
db.customers.hasMany(db.orders);
db.orders.belongsTo(db.customers);

// Customers & Meals ==> Favorites C:M -> M:M
db.customers.belongsToMany(db.meals, { as: 'Meals', through: db.customer_favorites });
db.meals.belongsToMany(db.customers, { as: 'Customers', through: db.customer_favorites });

module.exports = db;


