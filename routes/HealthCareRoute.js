const express = require('express');
const healthcare_route = express();

//body-parser
const bodyParser = require('body-parser');
healthcare_route.use(bodyParser.json());
healthcare_route.use(bodyParser.urlencoded({ extended: true }));


//controller
const healthcareController = require('../controller/HealthCareController');

//middleware
const auth = require('../middleware/Auth');


//api
healthcare_route.post('/newHealthPlan', healthcareController.newHealthPlan);

module.exports = healthcare_route;