var express = require('express');
var router = express.Router();
var models = require('../db.js');
var middleware = require('../middleware.js')(models);

// Route Files
var user = require('./user');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth");
    next();
});

// Views
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Lunch Society'
  });
});

// Users
router.get('/api/v1/users', middleware.requireAuthentication, user.list);
router.get('/api/v1/users/:id', middleware.requireAuthentication, user.view);
router.post('/api/v1/user', user.create);
router.post('/api/v1/users/login', user.login);
router.put('/api/v1/user/:id', middleware.requireAuthentication, user.update);
router.delete('/api/v1/user/:id', middleware.requireAuthentication, user.delete);
router.delete('/api/v1/users/login', middleware.requireAuthentication, user.logout);


module.exports = router;
