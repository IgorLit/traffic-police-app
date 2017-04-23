'use strict';
module.exports = (roleRepository, errors) => {
    const BaseService = require('./base');

    Object.setPrototypeOf(RoleService.prototype, BaseService.prototype);

    function RoleService(roleRepository, errors) {
        BaseService.call(this, roleRepository, errors);

        var self = this;

        self.create = create;

        function create(data) {
            return new Promise((resolve, reject) => {
                var user = {
                    name: data.name
                };

                self.baseCreate(user)
                    .then(resolve).catch(reject);
            });
        }
    }

    return new RoleService(roleRepository, errors);
};