/*
Model Name: weeks
SQL Table Name: weeks
Description:
    Stores information about weeks.

Attributes:
-> Week ID
-> Week Name
-> From Date
-> To Date

Use Cases:


*/

module.exports = function(sequelize, DataTypes) {
    var weeks = sequelize.define('weeks', {
        name: {
            type: DataTypes.STRING
        },
        from_date: {
            type: DataTypes.DATEONLY
        },
        to_date: {
            type: DataTypes.DATEONLY
        },
        year: {
            type: DataTypes.INTEGER
        }
    }, {
        underscored: true,
        timestamps: false
    });

    return weeks;
};
