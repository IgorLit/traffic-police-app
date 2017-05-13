'use strict';
module.exports = BaseService;

function BaseService(repository, errors) {
    const defaults = {
        readChunk: {
            limit: 10,
            page: 1,
            order: 'asc',
            orderField: 'id'
        }
    };

    let self = this;

    this.readChunk = readChunk;
    this.read = read;
    this.baseCreate = baseCreate;
    this.baseUpdate = baseUpdate;
    this.delete = del;

    function readChunk(options) {
        return new Promise((resolve, reject) => {
            options = Object.assign({}, defaults.readChunk, options);

            let limit = options.limit;
            let offset = (options.page - 1) * options.limit;

            repository
                .findAll({
                    limit: limit,
                    offset: offset,
                    order: [[options.orderField, options.order.toUpperCase()]],
                    raw: true
                })
                .then(resolve).catch(reject);
        });
    }

    function read(id) {
        return new Promise((resolve, reject) => {
            id = parseInt(id);

            if (isNaN(id)) {
                reject(errors.invalidId);
                return;
            }

            repository.findById(id, { raw: true })
                .then((post) => {
                    if (post == null) reject(errors.notFound);
                    else resolve({"data":post});
                })
                .catch(reject);
        });
    }

    function baseCreate(data) {
        return new Promise((resolve, reject) => {
            repository.create(data)
                .then((result)=>{
                    resolve(result)
                }).catch(reject);
        });
    }

    function baseUpdate(id, data) {
        return  repository.update(data, { where: { id: id }})
                .then(() => self.read(id));
    }

    function del(id) {
           return repository.destroy({ where: { id: id } })
                .then(() => ({ success: true }));
    }
}