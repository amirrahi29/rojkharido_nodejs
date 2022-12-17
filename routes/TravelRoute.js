const express = require('express');
const travel_route = express();

//body-parser
const bodyParser = require('body-parser');
travel_route.use(bodyParser.json());
travel_route.use(bodyParser.urlencoded({ extended: true }));


//controller
const travelController = require('../controller/TravelController');


//api
travel_route.get('/test', travelController.test);

module.exports = travel_route;