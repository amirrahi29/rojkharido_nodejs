const express = require('express');
const user_route = express();

//body-parser
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));


//controller
const userController = require('../controller/UserController');

//middleware
const auth = require('../middleware/Auth');


//api
user_route.post('/register', userController.register);
user_route.post('/login', userController.login);
user_route.post('/updateEmailOrPhoneVerified',auth, userController.updateEmailOrPhoneVerified);
user_route.post('/forgetPassword', userController.forgetPassword);
user_route.post('/updateForgetPassword',auth, userController.updateForgetPassword);
user_route.post('/logout', auth, userController.logout);

module.exports = user_route;