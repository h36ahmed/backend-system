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
    var users = sequelize.import(__dirname + "/users.js");
    var restaurants = sequelize.import(__dirname + "/restaurants.js");

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
            type: DataTypes.DATE
        },
        phone_number: {
            type: DataTypes.INTEGER,
            validate: {
                len: [9]
            }
        },
        profile_image: {
            type: DataTypes.STRING
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: restaurants,
                key: 'id'
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

    return owners;
};
