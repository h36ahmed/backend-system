/*
Model Name: orders
SQL Table Name: orders
Description:
    Stores information about restaurant's orders made by customers.

Attributes:
-> Order ID
-> Order Date
-> Status
-> Pick Up Time ID
-> Offer ID
-> Customer ID

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var orders = sequelize.define('orders', {
        order_date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'active',
            allowNull: false,
            validate: {
                isIn: [['cancelled', 'active', 'completed', 'error']]
            }
        }
    }, {
        underscored: true,
        timestamps: false
    });

    return orders;
};
