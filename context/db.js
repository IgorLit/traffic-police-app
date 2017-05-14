'use strict';
module.exports = (Sequelize, config) => {
    let sequelize;
    if (process.env.NODE_ENV === 'production') {
        const options = {
            host: config.prod.host,
            dialect: config.prod.dialect,
            logging: false,
            define: {
                timestamps: true,
                paranoid: true,
                defaultScope: {
                    where: {
                        deletedAt: {$eq: null}
                    }
                }
            }
        };
        sequelize = new Sequelize(config.prod.name, config.prod.user, config.prod.password, options);
        //sequelize = new Sequelize(process.env.NODE_ENV.DATABASE_URL);
    }
    else{
        sequelize = new Sequelize(config.dev.connection_uri);
    }

    const Am = require('../models/am')(Sequelize, sequelize);
    const Driver = require('../models/driver')(Sequelize, sequelize);
    const Jacked = require('../models/jacked')(Sequelize, sequelize);
    const Mark = require('../models/mark')(Sequelize, sequelize);
    const Firm = require('../models/firm')(Sequelize, sequelize);
    const Country = require('../models/country')(Sequelize, sequelize);

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
        am: Am,
        driver: Driver,
        jacked: Jacked,
        mark: Mark,
        firm: Firm,
        country: Country,
        sequelize: sequelize
    };
};