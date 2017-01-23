/*
Model Name: customerFavorites
SQL Table Name: customerFavorites
Description:
    Stores information about customer's favorites.

Attributes:
-> Customer ID
-> Meal ID
-> Number of Times Ordered From Favorites

Methods:
-> toPublicJSON: This outputs only the fields that should be seen by public.

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {

    var customerFavorites = sequelize.define('customerFavorites', {
        n_ordered_from_fav: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            }
        }
    }, {
        timestamps: false
    });

    return customerFavorites;
};
