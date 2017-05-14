'use strict';
const express = require('express');

function BaseController(service, promiseHandler) {
    let self = this;

    this.registerRoutes = registerRoutes;
    this.router = express.Router();
    this.routes = {
        '/:id': [{method: 'get', cb: read}, {method: 'delete', cb: del}, {method: 'put', cb: update}]
    };

    function readAll(req, res) {
        promiseHandler(res,
            service.readChunk(req.params)
        );
    }

    function read(req, res) {
        promiseHandler(res,
            service.read(req.params.id)
        );
    }

    function create(req, res) {
        promiseHandler(res,
            service.create(req.body)
        );
    }

    function update(req, res) {
        promiseHandler(res,
            service.update(req)
        );
    }

    function del(req, res) {
        const id = req.params.id;
        promiseHandler(res,
            service.delete(id)
        );
    }

    function registerRoutes() {
        for (let route in self.routes) {
            if (!self.routes.hasOwnProperty(route)) {
                continue;
            }

            let handlers = self.routes[route];

            if (handlers == undefined) continue;

            for (let handler of handlers) {
                self.router[handler.method](route, handler.cb);
            }
        }
    }
}

module.exports = BaseController;