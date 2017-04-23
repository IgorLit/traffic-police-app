'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('firm', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        FIRM_NAME:{
            type:Sequelize.CHAR(30),
        }
    });
};