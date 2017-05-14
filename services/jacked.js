'use strict';
module.exports = (jackedRepository, amRepository, driverRepository, errors) => {
    const BaseService = require('./base');
    const config = require('../config.json');
    const Promise = require("bluebird");
    Object.setPrototypeOf(JackedService.prototype, BaseService.prototype);

    function JackedService(jackedRepository, errors) {
        BaseService.call(this, jackedRepository, errors);

        let self = this;

        self.create = create;
        self.update = update;
        self.readChunk = readChunk;
        self.read = read;
        function read(id) {
            return new Promise((resolve, reject) => {
                jackedRepository.find({
                    where: {
                        id: id
                    },
                    include: [
                        {
                            model: amRepository,
                            attributes: ["AM_REG_NUMBER"]
                        }, {
                            model: driverRepository,
                            attributes: ["DRIVER_FIO"]
                        }
                    ]
                }).then((result) => {
                    result["AM"] = result["am.AM_REG_NUMBER"];
                    result["DRIVER"] = result["driver.DRIVER_FIO"];
                    delete  result["am.AM_REG_NUMBER"];
                    delete  result["driver.DRIVER_FIO"];
                    resolve({"data": result})
                }).catch(reject);
            });
        }

        function readChunk(options) {
            return new Promise((resolve, reject) => {
                options = Object.assign({}, config.defaults.readChunk, options);

                let limit = Number(options.length);
                let offset = Number(options.start);
                let searchKey = '%' + options.search.value + '%';
                let orderColumnNumber = Number(options.order[0].column);
                let orderColumn = options.columns ? options.columns[orderColumnNumber].data : "JC_JACKDATE";

                jackedRepository.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [[orderColumn, options.order[0].dir.toUpperCase()]],
                        raw: true,
                        where: {
                            $or: [
                                {
                                    JC_JACKDATE: {
                                        $like: searchKey
                                    }
                                }, {
                                    JC_REPORT_DATE: {
                                        $like: searchKey
                                    }
                                }, {
                                    JC_ADDITIONAL: {
                                        $like: searchKey
                                    }
                                }, {
                                    JC_FOUND: {
                                        $like: searchKey
                                    }
                                }

                            ]
                        },
                        include: [
                            {
                                model: amRepository,
                                attributes: ["AM_REG_NUMBER"]
                            }, {
                                model: driverRepository,
                                attributes: ["DRIVER_FIO", "DRIVER_CATEGORY", "DRIVER_RULES_DATE"]
                            }
                        ]
                    }
                ).then((result) => {
                    for (let i = 0; i < result.rows.length; i++) {
                        result.rows[i]["AM"] = result.rows[i]["am.AM_REG_NUMBER"];
                        result.rows[i]["DRIVER"] = result.rows[i]["driver.DRIVER_FIO"];
                        result.rows[i]["DRIVER_RULES_DATE"] = result.rows[i]["driver.DRIVER_RULES_DATE"];
                        result.rows[i]["DRIVER_CATEGORY"] = result.rows[i]["driver.DRIVER_CATEGORY"];
                        delete  result.rows[i]["am.AM_REG_NUMBER"];
                        delete  result.rows[i]["driver.DRIVER_FIO"];
                        delete  result.rows[i]["driver.DRIVER_RULES_DATE"];
                        delete  result.rows[i]["driver.DRIVER_CATEGORY"];
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
            let entity = {

                JC_JACKDATE: data.JC_JACKDATE,
                JC_REPORT_DATE: data.JC_REPORT_DATE,
                JC_ADDITIONAL: data.JC_ADDITIONAL,
                JC_FOUND: data.JC_FOUND
            };
            return Promise.all([
                self.baseCreate(entity),
                amRepository.findById(data.am),
                driverRepository.findById(data.driver)
            ]).spread((jacked, am, driver) => {
                return new Promise.all([
                    jacked.setAm(am),
                    jacked.setDriver(driver),
                    jacked
                ]);
            }).spread((am, driver, jacked) => self.read(jacked.id).then(resolve));
        }

        function update(req) {
            let keys = Object.keys(req.body.data);
            let key = Number.parseInt(keys[0]);
            let data = req.body.data[key];

            return Promise.all([
                self.baseUpdate(req.params.id || data.id, data),
                amRepository.findById(data.am),
                driverRepository.findById(data.driver)
            ]).spread((jacked, am, driver) => {
                if (jacked && am && driver)
                    return new Promise.all([
                        jacked.data,
                        jacked.data.setAm(am),
                        jacked.data.setDriver(driver)
                    ]);
                else return [jacked.data];
            }).spread((jacked, am, driver) => self.read(jacked.id));
        }


    }

    return new JackedService(jackedRepository, errors);
};