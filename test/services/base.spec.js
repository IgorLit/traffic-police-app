'use strict';
const data = {
    42: {
        id: 42,
        name: 'Batman'
    }
};
const Base = require('../../services/base');
const errors = require('../../utils/errors');
const repository = require('../mocks/repository')(data);

const service =  new Base(repository, errors);

describe('Test set for Service.Base', () => {
    beforeEach(() => repository.mockClear());

    describe('>> Module', () => {
        test('Should imported function', () => {
            expect(typeof Base).toBe('function');
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

            expect(records).toEqual(data);
        });

        it('Should use default values', async () => {
            await service.readChunk();
            await service.readChunk({ limit: 100 });
            await service.readChunk({ page: 3 });
            await service.readChunk({ orderField: 'name' });
            await service.readChunk({ order: 'desc' });

            expect(repository.findAll)
                .toHaveBeenCalledTimes(5);

            expect(repository.findAll.mock.calls[0][0])
                .toMatchObject({ limit: 10, offset: 0,
                    order: [['id','ASC']]
                });
            expect(repository.findAll.mock.calls[2][0])
                .toMatchObject({ offset: 20 });

            expect(repository.findAll.mock.calls[3][0])
                .toMatchObject({ order: [['name','ASC']] });

            expect(repository.findAll.mock.calls[4][0])
                .toMatchObject({ order: [['id','DESC']] });
        });

        it('Should calculate offset', async () => {
            await service.readChunk({ limit: 10, page: 1 });
            await service.readChunk({ limit: 5, page: 2 });

            expect(repository.findAll)
                .toHaveBeenCalledTimes(2);

            expect(repository.findAll.mock
                .calls[0][0].offset).toBe(0);
            expect(repository.findAll.mock
                .calls[1][0].offset).toBe(5);
        });
    });

     describe('>> Reading', () => {
         it('Should returned promise', () => {
             expect(service.read())
                 .toBeInstanceOf(Promise);
         });

         it('Should returned record by id', async () => {
             let record = await service.read(42);

             expect(repository.findById)
                 .toHaveBeenCalled();

             expect(record).toEqual({data: data[42]});
         });

         it(`Should returned error,
        if record not found`, async () => {
             expect.assertions(2);

             try {
                 await await service.read(9000);
             } catch (error) {

                 expect(repository.findById)
                     .toHaveBeenCalled();

                 expect(error).toEqual(errors.notFound);

             }
         });

         it(`Should returned error,
        if id not Int`, async () => {
             expect.assertions(2);

             try {
                 await await service.read('surprise!');
             } catch (error) {

                 expect(repository.findById)
                     .not.toHaveBeenCalled();

                 expect(error).toEqual(errors.invalidId);

             }
         });
     });

     describe('>> Creating', () => {
         it('Should returned  promise', () => {
             expect(service.baseCreate())
                 .toBeInstanceOf(Promise);
         });

         it('Should create object', async () => {
             let record =
                 await service.baseCreate(data[42]);

             expect(repository.create)
                 .toHaveBeenCalled();

             expect(repository.create.mock.calls[0][0])
                 .toEqual(data[42]);

             expect(record).toEqual(data[42]);
         });
     });

     describe('>> Updating', () => {
         it('Should returned  promise', () => {
             expect(service.baseUpdate())
                 .toBeInstanceOf(Promise);
         });

         it('Should update object', async () => {
             let record = await service.baseUpdate(42,data[42]);

             expect(repository.update).toHaveBeenCalled();

             expect(repository.update.mock.calls[0][0])
                 .toEqual(data[42]);

             expect(repository.update.mock.calls[0][1])
                 .toEqual({ where: { id: 42 }} );

             expect(record)
                 .toEqual({"data":data[42]});
         });
     });

     describe('>> Deleting', () => {
         it('Should returned promise', () => {
             expect(service.delete())
                 .toBeInstanceOf(Promise);
         });
         it('Should delete object', async () => {
             let result = await service.delete(42);

             expect(repository.destroy).toHaveBeenCalled();

             expect(repository.destroy.mock.calls[0][0])
                 .toEqual({ where: { id: 42 }});

             expect(result).toEqual({ success: true });
         });
     });
});