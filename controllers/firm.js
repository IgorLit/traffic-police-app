'use strict';
module.exports = (FirmService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(FirmController.prototype, BaseController.prototype);

    function FirmController(FirmService, promiseHandler) {
        BaseController.call(this, FirmService, promiseHandler);

        this.routes['/'] = [{method: 'get', cb: readAll},
            {method: 'post', cb: create},
            {method: 'put', cb: update},
            {method: 'delete', cb: deleteFirm}];


        this.registerRoutes();
        return this.router;

        function update(req, res) {

            FirmService.update(req).then((result) => {
                res.json(result)
            }).catch((err) => res.send({error: err.message}));
        }

        function deleteFirm(req, res) {
            let keys = Object.keys(req.query.data);
            let key = Number.parseInt(keys[0]);
            promiseHandler(res,
                FirmService.delete(req.query.data[key].id)
            );
        }

        function create(req, res) {

            FirmService.create(req.body).then((result) => {
                res.json(result)
            }).catch((err) => res.send({error: err.message}));
        }

        function readAll(req, res) {
            FirmService.readChunk(req.query)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => res.send({error: err.message}));
        }
    }

    return new FirmController(FirmService, promiseHandler);
};