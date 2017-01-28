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
-> Pick Up Time
-> Offer ID
-> Customer ID

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var pickUpTimes = sequelize.import(__dirname + "/pickUpTimes.js");

    var orders = sequelize.define('orders', {
        order_date: {
            type: DataTypes.DATE,
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
        },
        pickup_time: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: pickUpTimes,
                key: 'pickup_time'
            }
        }
    }, {
        underscored: true
    });

    return orders;
};
