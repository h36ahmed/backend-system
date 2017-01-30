var _ = require('underscore');
var models = require('../db.js');

// GET /api/v1/invoices
exports.list = function(req, res) {
    var query = req.query;
    var where = {};

    models.invoices.findAll({
        where: where,
        include: [{
            model: models.customers,
            attributes: ['first_name', 'last_name'],
            include: [{
                model: models.users,
                attributes: ['email']
            }]
        }]
    }).then(function(invoices) {
        res.json(invoices);
    }, function(e) {
        res.status(500).send();
    });
};

// POST /api/v1/invoice
exports.create = function(req, res) {
    var invoiceDetails = _.pick(req.body, 'invoice_date', 'status', 'tax_amount', 'total_payment_before_tax', 'notes', 'customer_id');
    models.invoices.create(invoiceDetails).then(function(invoice) {
        res.json(invoice);
    }, function(e) {
        res.status(400).json(e);
    });
};

// DELETE /api/v1/invoice/:id
exports.delete = function(req, res) {
    var invoiceID = parseInt(req.params.id, 10);
    models.invoices.destroy({
        where: {
            id: invoiceID
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No invoice found'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
};
