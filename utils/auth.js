'use strict';
module.exports = (authService, config, errors) => {
    return (req, res, next) => {
        let userId = req.signedCookies[config.cookie.auth];
        let path = req.url;
        let method = req.method;

        authService.checkPermissions(userId, path)
            .then(next)
            .catch(() => res.error(errors.accessDenied));
    };
};