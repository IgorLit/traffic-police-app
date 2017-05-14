'use strict';
module.exports = (markRepository, firmRepository, countryRepository, errors) => {
    const BaseService = require('./base');
    const config = require('../config.json');
    const Promise = require("bluebird");
    Object.setPrototypeOf(MarkService.prototype, BaseService.prototype);

    function MarkService(markRepository, errors) {
        BaseService.call(this, markRepository, errors);

        let self = this;

        self.create = create;
        self.update = update;
        self.readChunk = readChunk;
        self.read = read;
        function read(id) {
            return new Promise((resolve, reject) => {
                markRepository.find({
                    where: {
                        id: id
                    },
                    include: [
                        {
                            model: countryRepository,
                            attributes: ["COUNTRY_NAME"]
                        }, {
                            model: firmRepository,
                            attributes: ["FIRM_NAME"]
                        }
                    ]
                }).then((result) => {
                    result["COUNTRY"] = result["country.COUNTRY_NAME"];
                    result["FIRM"] = result["firm.FIRM_NAME"];
                    delete  result["country.COUNTRY_NAME"];
                    delete  result["firm.FIRM_NAME"];
                    resolve({"data": result})
                }).catch(reject);
            });
        }

        function readChunk(options) {
            return new Promise((resolve, reject) => {
                options = Object.assign({}, config.defaults.readChunk, options);

                var limit = Number(options.length);
                var offset = Number(options.start);
                var searchKey = '%' + options.search.value + '%';
                var orderColumnNumber = Number(options.order[0].column);
                var orderColumn;
                if (options.columns)
                    orderColumn = options.columns[orderColumnNumber].data;
                else
                    orderColumn = "MARK_NAME";
                markRepository.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [[orderColumn, options.order[0].dir.toUpperCase()]],
                        raw: true,

                        where: {
                            $or: [
                                {
                                    MARK_NAME: {
                                        $like: searchKey
                                    }
                                }

                            ]
                        },
                        include: [
                            {
                                model: countryRepository,
                                attributes: ["COUNTRY_NAME"]
                            }, {
                                model: firmRepository,
                                attributes: ["FIRM_NAME"]
                            }
                        ]
                    }
                ).then((result) => {
                    for (var i = 0; i < result.rows.length; i++) {
                        result.rows[i]["COUNTRY"] = result.rows[i]["country.COUNTRY_NAME"];
                        result.rows[i]["FIRM"] = result.rows[i]["firm.FIRM_NAME"];
                        delete  result.rows[i]["country.COUNTRY_NAME"];
                        delete  result.rows[i]["firm.FIRM_NAME"];
                    }
                    if (options.search.value.length > 0) {

                        resolve({
                            "data": result.rows,
                            "options": [],
                            "files": [],
                            "draw": options.draw,
                            "recordsTotal": result.count,
                            "recordsFiltered": result.rows.length
                        });
                    }
                    else {

                        resolve({
                            "data": result.rows,
                            "options": [],
                            "files": [],
                            "draw": options.draw,
                            "recordsTotal": result.count,
                            "recordsFiltered": result.count
                        });
                    }
                }).catch(reject);
            });
        }

        function create(req) {
            let data = req.data[0];
                let entity = {
                    MARK_NAME: data.MARK_NAME
                };
               return Promise.all([
                    self.baseCreate(entity),
                    firmRepository.findById(data.firm),
                    countryRepository.findById(data.country)
                ]).spread((mark, firm, country) => {
                    return new Promise.all([
                        firm.addMark(mark),
                        country.addMark(mark),
                        mark
                    ]);
                }).spread((firm, country, mark) =>  self.read(mark.id).then(resolve).catch(reject))
        }

        function grant(firmId, countryId) {

        }

        function update(req) {
            let keys = Object.keys(req.body.data);
            let key = Number.parseInt(keys[0]);
            let data = req.body.data[key];

               return Promise.all([
                    self.baseUpdate(req.params.id || data.id, data),
                    firmRepository.findById(data.firm),
                    countryRepository.findById(data.country)
                ]).spread((mark, firm, country) => {
                    if (mark && firm && country)
                        return new Promise.all([
                            mark.data,
                            firm.addMark(mark.data),
                            country.addMark(mark.data)
                        ]);
                    else return [mark.data]
                }).spread((mark, firm, country) => self.read(mark.id))
        }


    }

    return new MarkService(markRepository, errors);
};