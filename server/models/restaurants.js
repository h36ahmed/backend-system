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
-> Status
-> Longitude
-> Latitude
-> Payout Rate
-> Stripe Token


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
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.BIGINT(10)
        },
        logo: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'active'
        },
        longitude: {
            type: DataTypes.FLOAT
        },
        latitude: {
            type: DataTypes.FLOAT
        },
        payout_rate: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        stripe_res_id: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        underscored: true
    });

    return restaurants;
};
