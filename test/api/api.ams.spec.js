'use strict';


const app = require('../../index');
const request = require('supertest')(app);

const cookies = ['__auth_id=s%3A10323060.awmEUH0BH0RHLceD2iIZCGNhyDndJ9lZmuQYreFBn80; roleName=YWRtaW4%3D'];



describe('countries api tests', () => {

    const testData = {
        data: [{
            "id": 999999,
            "COUNTRY_NAME": "TEST COUNTRY999"
        }]
    };

    let ID = 999999;

    it('POST api/countries/', (done) => {
        return request
            .post('/api/countries/')
            .set('Cookie', cookies)
            .send(testData)
            .expect(201)
            .then((res) => {
                if (res.body.error) {
                    console.error(err);
                    throw res.body.error;
                }
                ID = res.body.data.id;
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });


    it('GET api/countries/', (done) => {
        return request
            .get('/api/countries')
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    throw res.body.error;
                }
                if (Array.isArray(res.body.data)) {
                    done()
                }
            }).catch((err) => {
                throw err;
            })
    });

    it('GET api/countries/id', (done) => {
        return request
            .get('/api/countries/10')
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    throw res.body.error;
                }
                done()
            })
            .catch((err) => {
                throw err;
            })
    });


    it(`PUT api/countries/${ID}`, (done) => {
        let testData = {
            "data": [{
                "COUNTRY_NAME": "UPDATED TEST NAME "
            }]
        };
        return request
            .put(`/api/countries/${ID}`)
            .set('Cookie', cookies)
            .send(testData)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    console.error(err);
                    throw res.body.error;
                }
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });


});


describe('firms api tests', () => {

    const testData = {
        data: [{
            "FIRM_NAME": "TEST FIRM999"
        }]
    };

    let ID = 999999;

    it('POST api/firms/', (done) => {
        return request
            .post('/api/firms/')
            .set('Cookie', cookies)
            .send(testData)
            .expect(201)
            .then((res) => {
                if (res.body.error) {
                    console.error(err);
                    throw res.body.error;
                }
                ID = res.body.data.id;
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });


    it('GET api/firms/', (done) => {
        return request
            .get('/api/firms')
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    throw res.body.error;
                }
                if (Array.isArray(res.body.data)) {
                    done()
                }
            }).catch((err) => {
                throw err;
            })
    });

    it('GET api/firms/id', (done) => {
        return request
            .get('/api/firms/10')
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    throw res.body.error;
                }
                done()
            })
            .catch((err) => {
                throw err;
            })
    });


    it(`PUT api/firms/${ID}`, (done) => {
        let testData = {
            "data": [{
                "FIRM_NAME": "UPDATED TEST firm NAME "
            }]
        };
        return request
            .put(`/api/firms/${ID}`)
            .set('Cookie', cookies)
            .send(testData)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    console.error(res.body.error);
                    throw res.body.error;
                }
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });


});


describe('marks api tests', () => {


    const testData = {
        data: [{
            "id": 999999,
            "MARK_NAME": "TEST FIRM999 ",
            "country": 999999,
            "firm": 999999
        }]
    };

    let ID = 999999;




    it('GET api/marks/', (done) => {
        return request
            .get('/api/marks')
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    throw res.body.error;
                }
                if (Array.isArray(res.body.data)) {
                    done()
                }
            }).catch((err) => {
                throw err;
            })
    });

    it('GET api/marks/id', (done) => {
        return request
            .get('/api/marks/10')
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    throw res.body.error;
                }
                done()
            })
            .catch((err) => {
                throw err;
            })
    });


    it(`PUT api/marks/${ID}`, (done) => {
        let testData = {
            "data": [{
                "FIRM_NAME": "UPDATED TEST firm NAME ",
                "firm": "999999",
                "country": "999999"
            }]
        };
        return request
            .put(`/api/marks/${ID}`)
            .set('Cookie', cookies)
            .send(testData)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    console.error(res.body.error);
                    throw res.body.error;
                }
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });


});


describe('ams api tests', () => {
    let ID = 999999;

    const testData = {
        data: [{
            "id": 999999,
            "AM_REG_NUMBER": "        ",
            "AM_COLOR": "RED    ",
            "AM_BODY_NUMBER": 0,
            "AM_ENGINE_NUMBER": 0,
            "AM_TECHPASSPORT_NUMBER": 0,
            "AM_BIRTHDATE": "1900-01-01T00:00:00.000Z",
            "AM_REGISTRATION_DATE": "1900-01-01T00:00:00.000Z",
            "createdAt": "2017-04-23T11:44:48.000Z",
            "updatedAt": "2017-05-21T09:32:02.000Z",
            "jackedCarId": 999999,
            "mark": 999999,
            "driver": 2
        }]
    };

    it('POST api/ams/', (done) => {
        return request
            .post('/api/ams/')
            .set('Cookie', cookies)
            .send(testData)
            .expect(201)
            .then((res) => {
                if (res.body.error) {
                    console.error(err);
                    throw res.body.error;
                }
                ID = res.body.data.id;
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });


    it('GET api/ams/', (done) => {
        return request
            .get('/api/ams')
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    throw res.body.error;
                }
                if (Array.isArray(res.body.data)) {
                    done()
                }
            }).catch((err) => {
                throw err;
            })
    });

    it('GET api/ams/id', (done) => {
        return request
            .get('/api/ams/10')
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    throw res.body.error;
                }
                done()
            })
            .catch((err) => {
                throw err;
            })
    });


    it(`PUT api/ams/${ID}`, (done) => {
        let testData = {
            "data": [{
                "AM_REG_NUMBER": "1234567  "
            }]
        };
        return request
            .put(`/api/ams/${ID}`)
            .set('Cookie', cookies)
            .send(testData)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    console.error(res.body.error);
                    throw res.body.error;
                }
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });


});


describe('deleting', () => {



    it(`DELETE api/countries/999999`, (done) => {
        return request
            .delete(`/api/countries/999999`)
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    console.error(res.body.error);
                    throw res.body.error;
                }
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    })

    it(`DELETE api/marks/999999`, (done) => {
        return request
            .delete(`/api/marks/999999`)
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    console.error(res.body.error);
                    throw res.body.error;
                }
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });


    it(`DELETE api/firms/999999`, (done) => {
        return request
            .delete(`/api/firms/999999`)
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    console.error(res.body.error);
                    throw res.body.error;
                }
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });

    it(`DELETE api/ams/999999`, (done) => {
        return request
            .delete(`/api/ams/999999`)
            .set('Cookie', cookies)
            .expect(200)
            .then((res) => {
                if (res.body.error) {
                    console.error(res.body.error);
                    throw res.body.error;
                }
                done();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            })
    });
});