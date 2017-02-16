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
        }
    }, {
        underscored: true,
        timestamps: false
    });

    return offers;
};
