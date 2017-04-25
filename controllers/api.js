'use strict';
const express = require('express');

module.exports = (userService, roleService, authService, amService, driverService, jackedService, firmService, countryService, markService, config) => {
    const router = express.Router();

    const userController = require('./user')(userService, promiseHandler);
    const roleController = require('./role')(roleService, promiseHandler);
    const authController = require('./users')(authService,userService, config);
    const sessionController = require('./session')(authService, config);

    const amController = require('./am')(amService, promiseHandler);
    const driverController = require('./driver')(driverService, promiseHandler);
    const jackedController = require('./jacked')(jackedService, promiseHandler);
    const firmController = require('./firm')(firmService, promiseHandler);
    const countryController = require('./country')(countryService, promiseHandler);
    const markController = require('./mark')(markService, promiseHandler);

    router.use('/ams', amController);
    router.use('/drivers', driverController);
    router.use('/jacked', jackedController);
    router.use('/firms', firmController);
    router.use('/countries', countryController);
    router.use('/marks', markController);
    router.use('/session', sessionController);
    router.use('/users', authController);

    return router;
};

function promiseHandler(res, promise) {
    promise
        .then((data) => res.json(data))
        .catch((err) => res.send({error: err.message}));
}