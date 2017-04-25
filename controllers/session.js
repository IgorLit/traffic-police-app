'use strict';
const express = require('express');
const options = require('../config.json').facebook;
const Base64 = require('js-base64').Base64;

module.exports = (authService, config) => {
    const router = express.Router();

    router.post('/', (req, res) => { //authenticates credentials against database
        authService.login(req.body)
            .spread((userId, userRole) => {
                res.cookie(config.cookie.auth, userId, {signed: true});
                res.cookie(config.cookie.roleName, Base64.encode(userRole));
                res.redirect("/");
            })
            .catch((err) => res.error(err));
    });

    router.get('/new', (req, res) => { // gets the webpage that has the login form
        res.redirect("/");
    });
    router.delete('/', (req, res) => { //destroys session and redirect to /
        res.cookie(config.cookie.auth, '');
        res.cookie(config.cookie.roleName, '');
        res.redirect("/")
    });


    return router;
};