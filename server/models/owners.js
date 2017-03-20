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
-> Status
-> Restaurant ID
-> User ID

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {
    var owners = sequelize.define('owners', {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date_joined: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        phone_number: {
            type: DataTypes.BIGINT(10)
        },
        profile_image: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'inactive',
            validate: {
                isIn: ['active', 'inactive']
            }
        }
    }, {
        timestamps: false,
        underscored: true
    });

    return owners;
};
