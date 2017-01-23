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
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ASSOCIATIONS

db.customers.belongsToMany(db.meals, { as: 'Meals', through: db.customerFavorites });
db.meals.belongsToMany(db.customers, { as: 'Customers', through: db.customerFavorites });

module.exports = db;


