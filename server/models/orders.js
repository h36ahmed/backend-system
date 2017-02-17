/*
Model Name: orders
SQL Table Name: orders
Description:
    Stores information about restaurant's orders made by customers.

Attributes:
-> Order ID
-> Order Date
-> Cancelled?
-> Active?
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
        cancelled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        underscored: true,
        timestamps: false
    });

    return orders;
};
