/*
Model Name: payouts
SQL Table Name: payouts
Description:
    Stores information about payouts that need to be sent to the restaurants monthly.

Attributes:
-> Payout ID
-> Payment
-> Charged?
-> Note
-> Invoice Date
-> Restaurant ID

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var payouts = sequelize.define('payouts', {
        payout_date: {
            type: DataTypes.DATEONLY,
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

    return payouts;
};
