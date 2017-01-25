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
        }
    }, {
        underscored: true
    });

    return feedbacks;
};
