'use strict';
const Promise = require('bluebird');
const bcrypt = require('bcryptjs');

module.exports = (userRepository, roleRepository, errors) => {
    return {
        login: login,
        register: register,
        checkPermissions: checkPermissions
    };

    function login(data) {
        return new Promise((resolve, reject) => {
            userRepository.findOne({
                where: {
                    $or: [
                        {
                            email: data.email
                        },
                        {
                            id: data.id
                        }
                    ]

                }, attributes: ['id', 'password']
            })
                .then((user) => {
                    if (user === null)
                        resolve(null);
                    else
                        user.getRoles().then((roles) => {
                            if (roles != null) resolve([user.id, roles[0].name]);
                            else reject(errors.wrongCredentials);
                        });
                })
                .catch(reject);
        });
    }


    function register(data) {
        return new Promise((resolve, reject) => {
                bcrypt.hash(data.password, 5, function (err, hash) {
                    if (err) {
                        throw err;
                    }
                    let user = {
                        id: Math.floor(Math.random() * 999999 + 10000000),
                        email: data.email,
                        password: hash,
                        firstname: data.firstname,
                        lastname: data.lastname
                    };

                    Promise.all([
                        userRepository.create(user),
                        roleRepository.findOne({where: {name: "user"}})
                    ])
                        .spread((user, role) => {
                            role.addUser(user);
                            resolve([user.id, role.name]);
                        }).catch(reject);
                });
        });
    }

    function checkPermissions(userId, route) {
        return new Promise((resolve, reject) => {
            /* if (permissions[route] == undefined) resolve();
             else if (userId == undefined) reject();
             else {
             Promise.all([
             userRepository.findById(userId),
             roleRepository.findOne({where: {name: permissions[route]}})
             ])
             .spread((user, role) => {
             return user.hasRole(role);
             })
             .then((has) => {
             if (has) resolve();
             else reject();
             })
             .catch(reject);
             }*/
            resolve();
        });
    }

};