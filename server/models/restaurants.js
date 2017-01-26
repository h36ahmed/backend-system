/*
Model Name: restaurants
SQL Table Name: restaurants
Description:
    Stores information about the restaurants.

Attributes:
-> Restaurant ID
-> Restaurant Name
-> Street Address
-> City
-> State
-> Country
-> Postal Code
-> Phone Number
-> Logo
-> Visible?

Methods:
-> toPublicJSON: This outputs only the fields that should be seen by public.

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {
    var restaurants = sequelize.define('restaurants', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: ["^[a-z]+$", 'i']
            }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: ["^[a-z]+$", 'i']
            }
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: ["^[a-z]+$", 'i']
            }
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },
        phone_number: {
            type: DataTypes.INTEGER,
            validate: {
                len: [10]
            }
        },
        logo: {
            type: DataTypes.STRING
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: false,
        underscored: true
    });

    return restaurants;
};
