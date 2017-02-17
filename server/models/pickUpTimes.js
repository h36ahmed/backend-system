/*
Model Name: pickUpTimes
SQL Table Name: pickUpTimes
Description:
    Stores information about Pickup Times Available.

Attributes:
-> pickUpTime ID
-> pickUpTime

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var pickUpTimes = sequelize.define('pickUpTimes', {
        pickup_time: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: false,
        underscored: true
    });

    return pickUpTimes;
};
