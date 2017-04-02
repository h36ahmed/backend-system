/*
Model Name: payouts
SQL Table Name: payouts
Description:
    Stores information about payouts that need to be sent to the restaurants monthly.

Attributes:
-> Payout ID
-> Payout Date
-> Total Meals
-> Status
-> Tax Amount
-> Total Payment Before Tax
-> Note
-> Restaurant ID
-> Week ID

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var payouts = sequelize.define('payouts', {
        payout_date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        total_meals: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'created',
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
