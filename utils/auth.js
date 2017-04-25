'use strict';
module.exports = (authService, config, errors) => {
    return (req, res, next) => {
        let userId = req.signedCookies[config.cookie.auth];
        let roleName = req.cookies[config.cookie.roleName];
        let path = req.url;
        let method = req.method;

        authService.checkPermissions(userId, path, method, roleName)
            .then(next)
            .catch(() => res.error(errors.accessDenied));
    };
};