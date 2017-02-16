/*
Model Name: invoices
SQL Table Name: invoices
Description:
    Stores information about payments charged to the customers monthly.

Attributes:
-> Invoice ID
-> Payment
-> Charged?
-> Note
-> Invoice Date
-> Customer ID

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var invoices = sequelize.define('invoices', {
        invoice_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: true,
            validate: {
                isIn: ['created', 'declined', 'paid', 'disputed', 'incorrect']
            }
        },
        tax_amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        total_payment_before_tax: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        notes: {
            type: DataTypes.STRING
        }
    }, {
        underscored: true,
        timestamps: false
    });

    return invoices;
};
