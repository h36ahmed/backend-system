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

db.owners.belongsTo(db.users);
db.customers.belongsTo(db.users);
db.restaurants.belongsTo(db.owners);
db.referralCodes.belongsTo(db.users);

db.paymentPlans.hasMany(db.customers);
db.customers.hasMany(db.feedbacks);
db.orders.hasMany(db.feedbacks, {as: 'order'});
db.customers.hasMany(db.invoices, {as: 'customer'});
db.restaurants.hasMany(db.meals, {as: 'restaurant'});
db.meals.hasMany(db.offers, {as: 'meal'});
db.offers.hasMany(db.orders, {as: 'offer'});
db.customers.hasMany(db.orders, {as: 'customer'});


db.customers.belongsToMany(db.meals, { as: 'Meals', through: db.customerFavorites });
db.meals.belongsToMany(db.customers, { as: 'Customers', through: db.customerFavorites });

module.exports = db;


