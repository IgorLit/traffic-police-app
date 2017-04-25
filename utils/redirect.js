'use strict';
module.exports = (config, permissions) => {
    return (req, res, next) => {
        try {
            let key = '/' + req.path.split("/", 2)[1];
            key = key.split("?", 1)[0];
            let perm = permissions[req.method];
            if (req.path === '/' || req.path === '/register.html') {
                return req.signedCookies[config.cookie.auth] && req.cookies[config.cookie.roleName] ? res.redirect('/panel.html') : next();
            }
            if (perm[key] || perm[key + '/new']) {
                if (perm[key] === '*' || perm[key + '/new'] === '*') {
                    return next();
                }
                return req.signedCookies[config.cookie.auth] && req.cookies[config.cookie.roleName] ? next() : res.redirect('/');
            }
            else {
                return next();
            }
        }
        catch (error) {
            res.redirect('/');
        }
    };
};