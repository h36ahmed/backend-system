/*
Model Name: owners
SQL Table Name: owners
Description:
    Stores information about the owners.

Attributes:
-> Owner ID
-> First Name
-> Last Name
-> Date Joined
-> Phone Number
-> Profile Image
-> Restaurant ID
-> User ID

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {
    var owners = sequelize.define('owners', {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: ["^[a-z]+$", 'i']
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: ["^[a-z]+$", 'i']
            }
        },
        date_joined: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        phone_number: {
            type: DataTypes.BIGINT(10)
        },
        profile_image: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        underscored: true
    });

    return owners;
};
