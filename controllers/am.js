'use strict';
module.exports = (amService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(AmController.prototype, BaseController.prototype);

    function AmController(amService, promiseHandler) {
        BaseController.call(this, amService, promiseHandler);

        this.routes['/'] = [{method: 'get', cb: readAll},
            {method: 'post', cb: create},
            {method: 'put', cb: update},
            {method: 'delete', cb: deleteAm}];


        this.registerRoutes();
        return this.router;

        function update(req, res) {
            amService.update(req).then((ams) => {
                res.json(ams)
            }).catch((err) => res.send({error: err.message}));

        }

        function deleteAm(req, res) {
            let keys = Object.keys(req.query.data);
            let key = Number.parseInt(keys[0]);
            promiseHandler(res,
                amService.delete(req.query.data[key].id)
            );
        }

        function create(req, res) {
            amService.create(req.body).then((ams) => {
                res.json(ams)
            }).catch((err) => res.send({error: err.message}));

        }

        function readAll(req, res) {
            amService.readChunk(req.query)
                .then((ams) => {
                    res.json(ams)
                })
                .catch((err) => res.send({error: err.message}));
        }


    }

    return new AmController(amService, promiseHandler);
};