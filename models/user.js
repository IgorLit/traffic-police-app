'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('users', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            },
            unique: true
        },
        password: Sequelize.STRING,

        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING
    });
};