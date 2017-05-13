'use strict';
module.exports = (roleRepository, errors) => {
    const BaseService = require('./base');

    Object.setPrototypeOf(RoleService.prototype, BaseService.prototype);

    function RoleService(roleRepository, errors) {
        BaseService.call(this, roleRepository, errors);

        var self = this;

        self.create = create;

        function create(data) {
                var user = {
                    name: data.name
                };

               return self.baseCreate(user);
        }
    }

    return new RoleService(roleRepository, errors);
};