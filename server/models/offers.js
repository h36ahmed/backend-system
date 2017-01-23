/*
Model Name: offers
SQL Table Name: offers
Description:
    Stores information about offers that are available to the customer for a particular date.

Attributes:
-> Offer ID
-> Offer Date
-> Plates Left
-> Meal ID


Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var meals = sequelize.import(__dirname + "/meals.js");

    var offers = sequelize.define('offers', {
        offer_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        plates_left: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            }
        },
        meal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: meals,
                key: 'id'
            }
        }
    });

    return offers;
};
