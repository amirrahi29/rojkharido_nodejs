const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

//image access
//image
app.use(express.static('public'));

//=================all databases start===================================//
// restaurant_grocery database
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/rojkharido");
//if the db connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
});
// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});
//=================databases end===================================//  



//user route
const user_route = require('./routes/UserRoute');
app.use('/api',user_route);

//contact route
const contact_route = require('./routes/ContactRoute');
app.use('/api',contact_route);



//start server
app.listen(process.env.PORT || 1000, function () {
    console.log("Server is ready");
});