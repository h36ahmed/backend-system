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
-> Pick Up ID
-> Offer ID
-> Customer ID

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var pickUpTimes = sequelize.import(__dirname + "/pickUpTimes.js");
    var customers = sequelize.import(__dirname + "/customers.js");
    var offers = sequelize.import(__dirname + "/offers.js");

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
        active:  {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        pickup_time_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: pickUpTimes,
                key: 'id'
            }
        },
        offer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: offers,
                key: 'id'
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

    });

    return orders;
};
