/*
Model Name: customers
SQL Table Name: customers
Description:
    Stores information about the customers.

Attributes:
-> Customer ID
-> First Name
-> Last Name
-> Age
-> Gender
-> Cycle Start Date
-> Cycle End Date
-> Date Joined
-> Meals Remaining
-> Phone Number
-> City
-> Country
-> Profile Image
-> Active?
-> Reminder Emails?
-> Payment Plan ID
-> User ID
-> Stripe Token
-> Referral Code Used

Methods:
-> toPublicJSON: This outputs only the fields that should be seen by public.

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {
    var referralCodes = sequelize.import(__dirname + "/referral_codes.js");

    var customers = sequelize.define('customers', {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 16,
                max: 90
            }
        },
        gender: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['male', 'female', 'other']]
            }
        },
        cycle_start_date: {
            type: DataTypes.DATEONLY
        },
        cycle_end_date: {
            type: DataTypes.DATEONLY
        },
        date_joined: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        meals_remaining: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 500
            }
        },
        phone_number: {
            type: DataTypes.BIGINT(10)
        },
        city: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        profile_image: {
            type: DataTypes.STRING
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        reminder_emails: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        referral_code_used: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: referralCodes,
                key: 'referral_code'
            }
        },
        stripe_token: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        underscored: true,
        instanceMethods: {
            toPublicJSON: function() {
                var json = this.toJSON();
                return _.omit(json, 'stripe_token', 'referral_code_used');
            },
            getStripeToken: function() {
                var json = this.toJSON();
                return _.pick(json, 'id', 'first_name', 'last_name', 'stripe_token');
            }
        }
    });

    return customers;
};
