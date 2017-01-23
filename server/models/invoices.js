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

    var customers = sequelize.import(__dirname + "/customers.js");

    var invoices = sequelize.define('invoices', {
        invoice_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        charged: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        payment: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: customers,
                key: 'id'
            }
        },
        notes: {
            type: DataTypes.STRING
        }
    });

    return invoices;
};
