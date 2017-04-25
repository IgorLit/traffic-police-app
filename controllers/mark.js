'use strict';
module.exports = (markService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(MarkController.prototype, BaseController.prototype);

    function MarkController(markService, promiseHandler) {
        BaseController.call(this, markService, promiseHandler);

        this.routes['/'] = [{method: 'get', cb: readAll},
            {method: 'post', cb: create},
            {method: 'put', cb: update},
            {method: 'delete', cb: deleteMark}];

        this.registerRoutes();
        return this.router;

        function update(req, res) {

            markService.update(req.body).then((result) => {
                res.json(result)
            }).catch((err) => res.send({error: err.message}));
        }

        function deleteMark(req, res) {
            let keys = Object.keys(req.query.data);
            let key = Number.parseInt(keys[0]);
            promiseHandler(res,
                markService.delete(req.query.data[key].id)
            );
        }

        function create(req, res) {

            markService.create(req.body).then((result) => {
                res.json(result)
                }).catch((err) => res.send({error: err.message}));
        }

        function readAll(req, res) {
            markService.readChunk(req.query)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => res.send({error: err.message}));
        }
    }

    return new MarkController(markService, promiseHandler);
};