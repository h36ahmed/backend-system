var _ = require('underscore');
var models = require('../db.js');


// GET /api/v1/owners
exports.list = function(req, res) {
  var query = req.query;
  var where = {};

  // QUERY PARAMETERS

  // fn -> First Name
  if (query.hasOwnProperty('first_name') && query.first_name.length > 0) {
    where.first_name = {
      $like: '%' + query.fn + '%'
    };
  }

  // ln -> Last Name
  if (query.hasOwnProperty('last_name') && query.last_name.length > 0) {
    where.last_name = {
      $like: '%' + query.ln + '%'
    };
  }

  // date_joined -> Date Joined
  if (query.hasOwnProperty('date_joined') && query.date_joined.length > 0) {
    where.date_joined = {
      $like: '%' + query.date_joined + '%'
    };
  }

  // email -> Email
  if (query.hasOwnProperty('email') && query.email.length > 0) {
    where.email = {
      $like: '%' + query.email + '%'
    };
  }

  if (query.hasOwnProperty('type') && query.type.length > 0) {
    where.type = {
      $like: '%' + query.type + '%'
    };
  }

  models.owners.findAll({
    attributes: ['first_name', 'email', 'last_name', 'date_joined', 'phone_number', 'profile_image', 'restaurant_id'],
    where: where,
    include: [{
      model: models.users,
      where: {
        id: models.owners.user_id
      }
    }]
  }).then(function(owners) {
    res.json(owners);
  }, function(e) {
    res.status(500).send();
  });
};

// GET /api/v1/owners/:id
exports.view = function(req, res) {
  var ownerID = parseInt(req.params.id, 10);
  models.owners.findById(ownerID).then(function(owner) {
    res.json(owner);
  }, function(e) {
    res.status(404).json(e);
  });
};

// POST /api/v1/owner
exports.create = function(req, res) {
  var ownerDetails = _.pick(req.body, 'first_name', 'last_name', 'phone_number', 'date_joined', 'profile_image', 'user_id');
  // When presenting a list option make option value user id and display value emails.
  models.owners.create(ownerDetails).then(function(owner) {
    res.json(owner);
  }, function(e) {
    res.status(400).json(e);
  });
};

// DELETE /api/v1/owner/:id
exports.delete = function(req, res) {
  var ownerID = parseInt(req.params.id, 10);
  models.owners.destroy({
    where: {
      id: ownerID
    }
  }).then(function(rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'No owner found'
      });
    } else {
      res.status(204).send();
    }
  }, function() {
    res.status(500).send();
  });
};
