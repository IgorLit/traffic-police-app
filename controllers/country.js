'use strict';
module.exports = (CountryService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(CountryController.prototype, BaseController.prototype);

    function CountryController(CountryService, promiseHandler) {
        BaseController.call(this, CountryService, promiseHandler);

        this.routes['/'] = [{method: 'get', cb: readAll},
            {method: 'post', cb: create},
            {method: 'put', cb: update},
            {method: 'delete', cb: deleteCountry}];

        this.registerRoutes();
        return this.router;

        function update(req, res) {
            CountryService.update(req).then((result) => {
                res.json(result)
            }).catch((err) => res.send({error: err.message}));
        }

        function deleteCountry(req, res) {
            let keys = Object.keys(req.query.data);
            let key = Number.parseInt(keys[0]);
            promiseHandler(res,
                CountryService.delete(req.query.data[key].id)
            );
        }

        function create(req, res) {

            CountryService.create(req.body).then((result) => {
                res.json(result)
            }).catch((err) => res.send({error: err.message}));
        }

        function readAll(req, res) {
            CountryService.readChunk(req.query)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => res.send({error: err.message}));
        }
    }

    return new CountryController(CountryService, promiseHandler);
};