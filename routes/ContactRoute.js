const express = require('express');
const contact_route = express();

//body-parser
const bodyParser = require('body-parser');
contact_route.use(bodyParser.json());
contact_route.use(bodyParser.urlencoded({ extended: true }));


//controller
const contactController = require('../controller/ContactController');


//api
contact_route.post('/contact', contactController.contact);

module.exports = contact_route;