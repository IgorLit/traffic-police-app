'use strict';

let data = {
    12 : {
        id: 12,
        name: 'domain.com'
    }
};
const service = require('../mocks/service')(data);
const BaseController = require('../../controllers/base');

let baseController = new BaseController(service, promiseHandler);

describe('Test set for Controller.Base', () => {

    describe('>>Module', () => {

        test('Should imported function', () => {
            expect(typeof BaseController).toBe('function');
        });

        test('Should create object', () => {
            expect(typeof baseController).toBe('object');
        });

    });
});

function promiseHandler(res, promise) {
    promise
        .then((data) => res.send(data))
        .catch((err) => res.error(err));
}
