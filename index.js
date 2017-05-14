'use strict';
const express = require('express');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const errors = require('./utils/errors');
const config = require('./config');
const permissions = require('./permissions');

const dbcontext = require('./context/db')(Sequelize, config);

const userService = require('./services/user')(dbcontext.user, dbcontext.role, errors);
const roleService = require('./services/role')(dbcontext.role, errors);
const authService = require('./services/auth')(dbcontext.user, dbcontext.role, errors, permissions);

const amService = require('./services/am')(dbcontext.am, dbcontext.mark, dbcontext.driver, errors);
const driverService = require('./services/driver')(dbcontext.driver, errors);
const jackedService = require('./services/jacked')(dbcontext.jacked, dbcontext.am, dbcontext.driver, errors);
const firmService = require('./services/firm')(dbcontext.firm, errors);
const countryService = require('./services/country')(dbcontext.country, errors);
const markService = require('./services/mark')(dbcontext.mark, dbcontext.firm, dbcontext.country, errors);

const apiController = require('./controllers/api')(userService, roleService, authService, amService, driverService, jackedService, firmService, countryService, markService, config);


const logger = require('./utils/logger');
const auth = require('./utils/auth')(authService, config, errors);
const redirect = require('./utils/redirect')(config, permissions);
const app = express();
app.use(cookieParser(config.cookie.key));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', redirect);
app.use(express.static('public'));


app.use('/api', logger);
app.use('/api', auth);
app.use('/api', apiController);

app.set('port', (process.env.PORT || 3000));
dbcontext.sequelize
    .sync()
    .then(() => {
        app.listen(app.get('port'), () => console.log(`Running on http://localhost:${app.get('port')}`));
    })
    .catch((err) => console.log(err));


module.exports = app;