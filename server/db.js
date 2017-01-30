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

// Users & Customers U:C -> 1:1
db.customers.belongsTo(db.users);

// Restaurants & Owners R:O -> 1:1
db.restaurants.belongsTo(db.owners);

// Referral Codes & Users RC:U -> 1:1
db.referralCodes.belongsTo(db.users);

// Restaurants & Meals R:M -> 1:M
db.restaurants.hasMany(db.meals);
db.meals.belongsTo(db.restaurants);

// Payment Plans & Customers PP:C -> 1:M
db.paymentPlans.hasMany(db.customers);
db.customers.belongsTo(db.paymentPlans);


// Orders & Feedbacks O:F -> 1:M
db.orders.hasMany(db.feedbacks);
db.feedbacks.belongsTo(db.orders);

// Customers & Invoices C:I -> 1:M
db.customers.hasMany(db.invoices);
db.invoices.belongsTo(db.customers);

// Meals & Offers M:O -> 1:M
db.meals.hasMany(db.offers);
db.offers.belongsTo(db.meals);

// Offers & Orders Of:Or -> 1:M
db.offers.hasMany(db.orders);
db.orders.belongsTo(db.offers);

// Customers & Orders C:O -> 1:M
db.customers.hasMany(db.orders);
db.orders.belongsTo(db.customers);

// Customers & Meals ==> Favorites C:M -> M:M
db.customers.belongsToMany(db.meals, { as: 'Meals', through: db.customerFavorites });
db.meals.belongsToMany(db.customers, { as: 'Customers', through: db.customerFavorites });

module.exports = db;


