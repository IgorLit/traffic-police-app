'use strict';

const express = require('express');

module.exports = (authService,userService, config) => {
    const router = express.Router();

    router.post('/', (req, res) => { //records the entered information into database as a new /user/xxx
        authService.register(req.body)
            .spread((userId, userRoleName) => {
                res.cookie(config.cookie.auth, userId, {signed: true});
                res.cookie(config.cookie.roleName, userRoleName);
                res.redirect("/");
            })
            .catch((err) =>  res.error(err.message));
    });

    router.get('/new', (req, res) => { // gets the webpage that has the registration form
        res.redirect("/register.html");
    });

    router.get('/', (req, res) => {
        userService.readChunk(req.query)
            .then((users) => {
                res.json(users)
            })
            .catch((err) => res.send({error: err.message}));
    });

    router.put('/', (req, res) => {
        userService.update(req.body).then((result)=>res.json(result))
            .catch((err) => res.send({error: err.message}));
        });


    return router;
};