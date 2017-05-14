"use strict";

const siege = require('siege');

siege()
    .on(3000)
    .for(1000).times
    .get('http://localhost:3000/api/session/new')
    .attack();