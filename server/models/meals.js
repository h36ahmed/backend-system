/*
Model Name: meals
SQL Table Name: meals
Description:
    Stores information about restaurant's meals.

Attributes:
-> Meal ID
-> Meal Name
-> Description
-> Tagline
-> Ingredients
-> Rating
-> Price
-> Meal Image
-> Available?
-> Restaurant ID

Methods:
-> toPublicJSON: This outputs only the fields that should be seen by public.

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {
    var meals = sequelize.define('meals', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        ingredients: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        meal_image: {
            type: DataTypes.STRING
        },
        default_meal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false,
        underscored: true
    });

    return meals;
};
