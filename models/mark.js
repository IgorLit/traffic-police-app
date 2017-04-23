'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('mark', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        MARK_NAME:{
            type:Sequelize.CHAR(30),
        }
    });
};