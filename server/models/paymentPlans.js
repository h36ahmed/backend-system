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

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var paymentPlans = sequelize.define('paymentPlans', {
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
        }
    }, {
        timestamps: false,
        underscored: true,
    });

    return paymentPlans;
};
