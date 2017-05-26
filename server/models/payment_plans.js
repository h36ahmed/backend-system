/*
Model Name: paymentPlans
SQL Table Name: paymentPlans
Description:
    Stores information about company's payment plans.

Attributes:
-> Payment Plan ID
-> Name
-> Description
-> Image
-> Price
-> Meals
-> Status

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var paymentPlans = sequelize.define('payment_plans', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        num_meals: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'inactive'
        },
        stripe_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        underscored: true
    });

    return paymentPlans;
};
