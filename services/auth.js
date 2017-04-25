'use strict';
const Promise = require('bluebird');
const bcrypt = require('bcryptjs');


module.exports = (userRepository, roleRepository, errors, permissions) => {
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

                }
            })
                .then((user) => {
                    if (user !== null) {


                        user.getRole().then((role) => role && bcrypt.compareSync(data.password, user.password)? resolve([user.id, role.name]): reject(errors.wrongCredentials));
                    } else {
                        reject(errors.wrongCredentials);
                    }

                })
                .catch(reject);
        });
    }


    function register(data) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(data.password, 5, function (err, hash) {
                if (err) {
                    reject(err);
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

    function checkPermissions(userId, route, method, roleName) {
        return new Promise((resolve, reject) => {
            let key = '/' + route.split("/", 2)[1];
            key = key.split("?", 1)[0];
            let perm = permissions[method];

            if (perm[key] === '*' || perm[key + '/new'] === '*') {
                resolve();
            } else if (!perm || !userId || !perm[key]) {
                reject();
            }
            Promise.all([
                userRepository.findById(userId),
                roleRepository.findOne({where: {name: roleName}})
            ])
                .spread((user, role) => user.hasRole(role))
                .then(isHas => isHas && perm[key].includes(roleName) ? resolve() : reject())
                .catch(reject);
            resolve();
        });
    }

};