/*
Model Name: users
SQL Table Name: users
Description:
    Stores information about the users.

Attributes:
-> User ID
-> Email
-> Salt
-> Password Hash
-> Password
-> Type
-> Confirmed Email?

Methods:
-> beforeValidate: This lower cases the email to avoid duplication.
-> toPublicJSON: This outputs only the fields that should be seen by public.
-> authenticate: This checks if user's email and password match.

Use Cases:
-> Creating Account
-> Authenicating Login

*/

var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

var keys = {
    cryptoKey: 'abc123!@#!',
    jwtKey: 'qwerty098'
};

module.exports = function (sequelize, DataTypes) {

    var users = sequelize.define('users', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING,
        },
        password_hash: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [6, 100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['owner', 'customer', 'admin']]
            }
        },
        confirmed_email: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: false,
        hooks: {
            beforeValidate: function (user, options) {
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        classMethods: {
            authenticate: function (body) {
                return new Promise(function (resolve, reject) {
                    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }

                    users.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function (user) {
                        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                            return reject();
                        }
                        resolve(user);
                    }, function (e) {
                        reject();
                    });
                });
            },
            findByToken: function (token) {
                return new Promise(function (resolve, reject) {
                    try {
                        var decodeJMT = jwt.verify(token, keys.jwtKey);
                        var bytes = cryptojs.AES.decrypt(decodeJMT.token, keys.cryptoKey);
                        var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
                        users.findById(tokenData.id).then(function (user) {
                            if (user) {
                                resolve(user);
                            } else {
                                reject();
                            }
                        }, function (e) {
                            reject();
                        })
                    } catch (e) {
                        reject();
                    }
                });
            }
        },
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'type', 'confirmed_email');
            },
            generateToken: function (type) {
                if (!_.isString(type)) {
                    return undefined;
                }
                try {
                    var stringData = JSON.stringify({
                        id: this.get('id'),
                        type: type
                    });
                    var encryptedData = cryptojs.AES.encrypt(stringData, keys.cryptoKey).toString();
                    var token = jwt.sign({
                        token: encryptedData
                    }, keys.jwtKey);
                    return token;
                } catch (e) {
                    console.error(e);
                    return undefined;
                }
            }
        }
    });

    return users;
};
