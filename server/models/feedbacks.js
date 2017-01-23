/*
Model Name: feedbacks
SQL Table Name: feedbacks
Description:
    Stores information about feedbacks given by customers.

Attributes:
-> Feedback ID
-> Order ID
-> Customer ID
-> Portion Size
-> Flavour
-> Overall
-> Comments

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var customers = sequelize.import(__dirname + "/customers.js");
    var orders = sequelize.import(__dirname + "/orders.js");

    var feedbacks = sequelize.define('feedbacks', {
        comments: {
            type: DataTypes.STRING
        },
        flavour: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                min: 0,
                max: 5
            }
        },
        portion_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                min: 0,
                max: 5
            }
        },
        overall: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                min: 0,
                max: 5
            }
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: orders,
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
        }

    });

    return feedbacks;
};
