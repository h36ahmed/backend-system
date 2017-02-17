/*
Model Name: referralCodes
SQL Table Name: referralCodes
Description:
    Stores information about referral codes.

Attributes:
-> Referral Code
-> Activate
-> Number of Times Used


Use Cases:


*/

module.exports = function(sequelize, DataTypes) {
    var referralCodes = sequelize.define('referral_codes', {
        referral_code: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            validate: {
                isAlphanumeric: true
            }
        },
        activate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        n_times_used: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        date_created: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        type: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        underscored: true
    });

    return referralCodes;
};
