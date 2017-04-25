'use strict';
module.exports = (userRepository, roleRepository, errors) => {
    const BaseService = require('./base');

    const config = require('../config.json');
    Object.setPrototypeOf(UserService.prototype, BaseService.prototype);

    function UserService(userRepository, roleRepository, errors) {
        BaseService.call(this, userRepository, errors);

        let self = this;

        self.update = update;
        this.readChunk = readChunk;
        function update(req) {
            let keys = Object.keys(req.data);
            let key = Number.parseInt(keys[0]);
            let data = req.data[key];
            return roleRepository.findAll({where: {name: data.role}})
                .then((role) => {
                if(!role.length){
                    return Promise.reject({message:"role not found"});
                }
                let roleId = role[0].id;
                    let user = {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email:data.email,
                        roleId: roleId
                    };
                    return userRepository.update(user, {where: {id: data.id}})
                        .then(() => userRepository.findById(data.id).then((user)=>{
                                return {"data": user};
                            }))
                });
        }
    }

    function readChunk(options) {
        return new Promise((resolve, reject) => {
            options = Object.assign({}, config.defaults.readChunk, options);

            let limit = Number(options.length);
            let offset = Number(options.start);
            let searchKey = '%' + options.search.value + '%';
            let orderColumnNumber = Number(options.order[0].column);
            let orderColumn;
            if (options.columns)
                orderColumn = options.columns[orderColumnNumber].data === 'id' ? 'email' : options.columns[orderColumnNumber].data;
            else
                orderColumn = "email";
            userRepository.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    order: [[orderColumn, options.order[0].dir.toUpperCase()]],
                    raw: true,

                    where: {
                        $or:[
                            {
                                email: {
                                    $like: searchKey
                                }
                            },
                            {
                                firstname: {
                                    $like: searchKey
                                }
                            },
                            {
                                lastname: {
                                    $like: searchKey
                                }
                            }
                        ]

                    },
                    include: [
                        {
                            model: roleRepository,
                            attributes: ["name"]
                        }
                    ]
                }
            ).then((result) => {
                for (let i = 0; i < result.rows.length; i++) {
                    result.rows[i]["role"] = result.rows[i]["role.name"];
                    delete  result.rows[i]["role.name"];
                }
                let records = options.search.value.length ? result.rows.length : result.count;

                resolve({
                    "data": result.rows,
                    "options": [],
                    "files": [],
                    "draw": options.draw,
                    "recordsTotal": result.count,
                    "recordsFiltered": records
                });

            }).catch((error) => {
                return reject(error);
            });
        });
    }

    return new UserService(userRepository, roleRepository, errors);
};