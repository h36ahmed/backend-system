var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/referral-codes
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.referralCodes.findAll({
        where: where
    }).then(function(referralCodes) {
        res.json(referralCodes);
    }, function(e) {
        res.status(500).send();
    });
};

// POST /api/v1/referral-code
exports.create = function(req, res) {
    var referralCodeDetails = _.pick(req.body, 'referral_code');
    models.referralCodes.create(referralCodeDetails).then(function(referralCode) {
        res.json(referralCode);
    }, function(e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/referral-code/:id
exports.delete = function(req, res) {
    var referralCodeID = parseInt(req.params.id, 10);
    models.referralCodes.destroy({
        where: {
            id: referralCodeID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No referral code found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
