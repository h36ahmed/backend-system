var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/payment-plans
exports.list = function(req, res) {
  var query = req.query;
  var where = {};

  models.paymentPlans.findAll({
    where: where
  }).then(function(paymentPlans) {
    res.json(paymentPlans);
  }, function(e) {
    res.status(500).send();
  });
};

// POST /api/v1/payment-plan
exports.create = function(req, res) {
  var paymentPlanDetails = _.pick(req.body, 'name', 'description', 'image', 'price');
  models.paymentPlans.create(paymentPlanDetails).then(function(paymentPlan) {
    res.json(paymentPlan);
  }, function(e) {
    res.status(400).json(e);
  });
};

// DELETE /api/v1/payment-plan/:id
exports.delete = function(req, res) {
  var paymentPlanID = parseInt(req.params.id, 10);
  models.paymentPlans.destroy({
    where: {
      id: paymentPlanID
    }
  }).then(function(rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'No payment plan found'
      });
    } else {
      res.status(204).send();
    }
  }, function() {
    res.status(500).send();
  });
};
