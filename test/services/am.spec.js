'use strict';
const data = {
    42: {
        id: 42,
        name: 'Batman'
    }
};

const Promise = require('bluebird');
const AmService = require('../../services/am');
const errors = require('../../utils/errors');
const amRepository = require('../mocks/repository')(data);
const markRepository = require('../mocks/repository')(data);
const driverRepository = require('../mocks/repository')(data);

const service =  AmService(amRepository,markRepository,driverRepository, errors);

describe('Test set for Service.Am', () => {
    beforeEach(() => amRepository.mockClear());

    describe('>> Module', () => {
        test('Should imported function', () => {
            expect(typeof AmService).toBe('function');
        });

        test('Should create object', () => {
            expect(typeof service).toBe('object');
        });
    });

    describe('>> Pagination', () => {
        test('should returned promise', () => {

            expect(service.readChunk())
                .toBeInstanceOf(Promise);

        });
        test('Should returned array of records', async () => {
            let records = await service.readChunk();

           expect(records).toHaveProperty('data');
           expect(records.data).toBeInstanceOf(Array);
        });

        it('Should calculate offset', async () => {
            await service.readChunk({ start: 10, length: 1 });
            await service.readChunk({ start: 5, length: 2 });

            expect(amRepository.findAndCountAll)
                .toHaveBeenCalledTimes(2);
        });
    });

    describe('>> Reading', () => {

        it('Should returned record by id', async () => {
            let record = await service.read(42);

            expect(amRepository.find)
                .toHaveBeenCalled();
            expect(record).toHaveProperty('data');
            expect(record.data).toBeInstanceOf(Object);
        });

        it(`Should returned error,
        if record not found`, async () => {
            expect.assertions(2);

            try {
                await  service.read(90000);
            } catch (error) {

                expect(amRepository.find)
                    .toHaveBeenCalled();

                expect(error).toEqual(errors.notFound);

            }
        });


    });

    describe('>> Creating', () => {
        it('Should returned  promise', () => {
            expect(service.create({data:[{}]}))
                .toBeInstanceOf(Promise);
        });

        it('Should create object', async () => {
            let record =
                await service.baseCreate(data[42]);

            expect(amRepository.create)
                .toHaveBeenCalled();

            expect(amRepository.create.mock.calls[0][0])
                .toEqual(data[42]);

            expect(record).toEqual(data[42]);
        });
    });

    describe('>> Updating', () => {
        it('Should returned  promise', () => {
            expect(service.update({body:{data:[{}]}, params:{id:42}}))
                .toBeInstanceOf(Promise);
        });

        it('Should update object', async () => {
            let record = await service.update({body:{data:[{}]}, params:{id:42}});

            expect(amRepository.update).toHaveBeenCalled();

            expect(amRepository.update.mock.calls[0][0])
                .toEqual({});

            expect(amRepository.update.mock.calls[0][1])
                .toEqual({ where: { id: 42 }} );

            expect(record)
                .toEqual({"data":data[42]});
        });
    });

});