'use strict';
module.exports = (data) => {
    const mock = {
        readChunk: jest.fn(params => Promise.resolve(data)),

        read: jest.fn(id => Promise.resolve(data[id])),

        create: jest.fn(data => Promise.resolve(data)),

        update: jest.fn(data => Promise.resolve([1, [data]])),

        delete: jest.fn(() => Promise.resolve(1))
    };

    mock.mockClear = () => {
        mock.readChunk.mockClear();
        mock.read.mockClear();
        mock.create.mockClear();
        mock.update.mockClear();
        mock.delete.mockClear();
    };

    return mock;
};