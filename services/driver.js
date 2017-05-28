'use strict';
module.exports = (DriverRepository, errors) => {
    const BaseService = require('./base');
    const config = require('../config.json');

    Object.setPrototypeOf(DriverService.prototype, BaseService.prototype);

    function DriverService(DriverRepository, errors) {
        BaseService.call(this, DriverRepository, errors);

        let self = this;

        self.create = create;
        self.update = update;
        self.readChunk = readChunk;

        function readChunk(options) {
            return new Promise((resolve, reject) => {
                options = Object.assign({}, config.defaults.readChunk, options);

                var limit = Number(options.length);
                var offset = Number(options.start);
                var searchKey = '%' + options.search.value + '%';
                var orderColumnNumber = Number(options.order[0].column);
                if (options.columns)
                    var orderColumn = options.columns[orderColumnNumber].data;
                else
                    var orderColumn = "id";
                return DriverRepository.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [[orderColumn, options.order[0].dir.toUpperCase()]],
                        raw: true,
                        where: {
                            $or: [
                                {
                                    DRIVER_FIO: {
                                        $like: searchKey
                                    }
                                }, {
                                    DRIVER_ADRESS: {
                                        $like: searchKey
                                    }
                                }

                            ]
                        }
                    }
                ).then((result) => {
                    let records = options.search.value.length ? result.rows.length : result.count;

                    resolve({
                        "data": result.rows,
                        "options": [],
                        "files": [],
                        "draw": options.draw,
                        "recordsTotal": result.count,
                        "recordsFiltered": records
                    });
                })
            });
        }

        function create(req) {
            const data = req.data[0];
            return self.baseCreate(data)
                .then((result) => ({"data": result}));
        }

        function update(req) {
            const keys = Object.keys(req.body.data);
            const key = Number.parseInt(keys[0]);
            const data = req.body.data[key];
            return self.baseUpdate(req.params.id || data.id, data);
        }


    }

    return new DriverService(DriverRepository, errors);
};