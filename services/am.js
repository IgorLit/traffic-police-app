'use strict';
module.exports = (amRepository, markRepository, driverRepository, errors) => {
    const BaseService = require('./base');
    const config = require('../config.json');
    const Promise = require("bluebird");
    Object.setPrototypeOf(AmService.prototype, BaseService.prototype);

    function AmService(amRepository, errors) {
        BaseService.call(this, amRepository, errors);

        let self = this;

        self.create = create;
        self.update = update;
        self.readChunk = readChunk;
        self.read = read;
        function read(id) {
            return amRepository.find({
                where: {
                    id: id
                },
                include: [
                    {
                        model: markRepository,
                        attributes: ["MARK_NAME"]
                    }, {
                        model: driverRepository,
                        attributes: ["DRIVER_FIO"]
                    }
                ]
            }).then((result) => {
                if (!result) {
                    throw errors.notFound;
                }
                result["MARK"] = result["mark.MARK_NAME"];
                result["DRIVER"] = result["driver.DRIVER_FIO"];
                delete  result["mark.MARK_NAME"];
                delete  result["driver.DRIVER_FIO"];
                return {"data": result};
            });
        }

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
                    var orderColumn = "AM_REG_NUMBER";
                amRepository.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [[orderColumn, options.order[0].dir.toUpperCase()]],
                        raw: true,
                        where: {
                            $or: [
                                 {
                                    AM_COLOR: {
                                        $like: searchKey
                                    }
                                }

                            ]
                        },
                        include: [
                            {
                                model: markRepository,
                                attributes: ["MARK_NAME"]
                            }, {
                                model: driverRepository,
                                attributes: ["DRIVER_FIO"]
                            }
                        ]
                    }
                ).then((result) => {
                    for (var i = 0; i < result.rows.length; i++) {
                        result.rows[i]["MARK"] = result.rows[i]["mark.MARK_NAME"];
                        result.rows[i]["DRIVER"] = result.rows[i]["driver.DRIVER_FIO"];
                        delete  result.rows[i]["mark.MARK_NAME"];
                        delete  result.rows[i]["driver.DRIVER_FIO"];
                    }
                    if (options.search.value.length > 0)
                        resolve({
                            "data": result.rows,
                            "options": [],
                            "files": [],
                            "draw": options.draw,
                            "recordsTotal": result.count,
                            "recordsFiltered": result.rows.length
                        });
                    else
                        resolve({
                            "data": result.rows,
                            "options": [],
                            "files": [],
                            "draw": options.draw,
                            "recordsTotal": result.count,
                            "recordsFiltered": result.count
                        });
                }).catch(reject);
            });
        }

        function create(req) {
            let data = req.data[0];
            return Promise.all([
                markRepository.findById(data.mark),
                driverRepository.findById(data.driver)
            ]).spread((mark, driver) => {
                if (!mark || !driver) {
                    throw `Error while creating object. ${mark ? 'Driver' : 'Mark'} id doesen\'t not exist`;
                }
                return self.baseCreate(data)
                    .then((am) => new Promise.all([
                        mark.addAm(am),
                        driver.addAm(am),
                        am
                    ]));
            }).spread((mark, driver, am) => {
                return self.read(am.id);
            });
        }

        function update(req) {
            const keys = Object.keys(req.body.data);
            const key = Number.parseInt(keys[0]);
            let data = req.body.data[key];
            const id = req.params.id || data.id;
            return Promise.all([
                self.baseUpdate(id, data),
                markRepository.findById(data.mark),
                driverRepository.findById(data.driver)
            ]).spread((am, mark, driver) => {
                if (am && mark && driver) {
                    return new Promise.all([
                        am.data,
                        mark.addAm(am.data),
                        driver.addAm(am.data)
                    ]);
                }
                else if (mark) {
                    return new Promise.all([
                        am.data,
                        mark.addAm(am.data)
                    ]);
                }
                else if (driver) {
                    return new Promise.all([
                        am.data,
                        driver.addAm(am.data)
                    ]);
                }
                else {
                    return [am.data];
                }
            }).spread((am, mark, driver) => {
                return self.read(am.id);
            })
        }
    }

    return new AmService(amRepository, errors);
};