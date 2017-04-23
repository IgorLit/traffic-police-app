'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('country', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        COUNTRY_NAME:{
            type:Sequelize.STRING,
            allowNull:false
        }
    });
};