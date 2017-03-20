/*
Model Name: customers
SQL Table Name: customers
Description:
    Stores information about the customers.

Attributes:
-> Customer ID
-> First Name
-> Last Name
-> Cycle Start Date
-> Cycle End Date
-> Date Joined
-> Meals Remaining
-> Postal Code
-> Profile Image
-> Status
-> Reminder Emails?
-> Payment Plan ID
-> User ID
-> Stripe Token
-> Referral Code Used

Methods:
-> toPublicJSON: This outputs only the fields that should be seen by public.

Use Cases:


*/

var _ = require('underscore');

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
        postal_code: {
            type: DataTypes.STRING,
            allowNull: false
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
