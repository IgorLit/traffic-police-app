'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('driver', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DRIVER_FIO:{
            type:Sequelize.CHAR(300),
            notNull:true
        },
        DRIVER_BIRTHDATE:{
            type:Sequelize.DATEONLY,
            notNull:true
        },
        DRIVER_ADRESS: {
            type:Sequelize.CHAR(300),
            notNull:true
        },
        DRIVER_PASSPORT:{
            type:Sequelize.INTEGER,
            notNull:true
        },
        DRIVER_RULES:{
            type:Sequelize.CHAR(100),
            notNull:true
        },
        DRIVER_RULES_DATE:{
            type:Sequelize.DATEONLY,
            notNull:true
        },
        DRIVER_CATEGORY:{
            type:Sequelize.CHAR(1),
            notNull:true
        }
    });
};