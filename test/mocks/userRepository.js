'use strict';
module.exports = (data) => {
    const mock = {
        findAll: jest.fn((params) => Promise.resolve(data)),

        findById: jest.fn((id) => {
            let user = data[id];
            user.addDomain = (domain) => Promise.resolve(domain);
            user.decrement = () => Promise.resolve(user);
           return Promise.resolve(user);
        }),

        create: jest.fn((data) => Promise.resolve(data)),

        update: jest.fn((data) => Promise.resolve([1, [data]])),

        destroy: jest.fn(() => Promise.resolve(1))
    };

    mock.mockClear = () => {
        mock.findAll.mockClear();
        mock.findById.mockClear();
        mock.create.mockClear();
        mock.update.mockClear();
        mock.destroy.mockClear();
    };

    return mock;
};