'use strict';
const test = require('tape');
const app = require('../../index');
const request = require('supertest')(app);

test('Correct ams returned', (t) => {
    return request
        .get('/api/ams')
        .set('Cookie', ['__auth_id=s%3A10323060.awmEUH0BH0RHLceD2iIZCGNhyDndJ9lZmuQYreFBn80; roleName=YWRtaW4%3D'])
        .expect(200)
        .then((res) => {
            t.end();
        }).catch(() => t.error(err, 'No error'))
});
