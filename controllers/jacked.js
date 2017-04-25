'use strict';
module.exports = (jackedService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(JackedController.prototype, BaseController.prototype);

    function JackedController(jackedService, promiseHandler) {
        BaseController.call(this, jackedService, promiseHandler);

        this.routes['/'] = [{method: 'get', cb: readAll},
            {method: 'post', cb: create},
            {method: 'put', cb: update},
            {method: 'delete', cb: deleteJacked}];

        this.registerRoutes();
        return this.router;

        function update(req, res) {

            jackedService.update(req.body).then((result) => {
                res.json(result)
            }).catch((err) => res.send({error: err.message}));
        }

        function deleteJacked(req, res) {
            let keys = Object.keys(req.query.data);
            let key = Number.parseInt(keys[0]);
            promiseHandler(res,
                jackedService.delete(req.query.data[key].id)
            );
        }

        function create(req, res) {

            jackedService.create(req.body).then((result) => {
                res.json(result)
            }).catch((err) => res.send({error: err.message}));
        }

        function readAll(req, res) {
            jackedService.readChunk(req.query)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => res.send({error: err.message}));
        }
    }

    return new JackedController(jackedService, promiseHandler);
};