'use strict';
module.exports = (Sequelize, config) => {

    const sequelize = new Sequelize(config.db.connection_uri);

    const Am = require('../models/am')(Sequelize,sequelize);
    const Driver = require('../models/driver')(Sequelize,sequelize);
    const Jacked = require('../models/jacked')(Sequelize,sequelize);
    const Mark = require('../models/mark')(Sequelize,sequelize);
    const Firm = require('../models/firm')(Sequelize,sequelize);
    const Country = require('../models/country')(Sequelize,sequelize);

    const User = require('../models/user')(Sequelize, sequelize);
    const Role = require('../models/role')(Sequelize, sequelize);

    Mark.hasMany(Am);
    Am.belongsTo(Mark);


    Country.hasMany(Mark);
    Mark.belongsTo(Country);

    Firm.hasMany(Mark);
    Mark.belongsTo(Firm);


    Driver.hasMany(Am);
    Am.belongsTo(Driver);


    Jacked.hasOne(Am);
    Am.belongsTo(Jacked);

    Jacked.hasOne(Driver);
    Driver.belongsTo(Jacked);

    User.belongsTo(Role);
    Role.hasMany(User);

    return {
        user: User,
        role: Role,
        am:Am,
        driver:Driver,
        jacked:Jacked,
        mark:Mark,
        firm:Firm,
        country:Country,
        sequelize: sequelize
    };
};