/*
Model Name: referralCodes
SQL Table Name: referralCodes
Description:
    Stores information about referral codes.

Attributes:
-> Referral Code
-> Activate
->


Use Cases:


*/

module.exports = function(sequelize, DataTypes) {
    var users = sequelize.import(__dirname + "/users.js");

    var referralCodes = sequelize.define('referralCodes', {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: users,
                key: 'id'
            }
        }
    }, {
        timestamps: false
    });

    return referralCodes;
};
