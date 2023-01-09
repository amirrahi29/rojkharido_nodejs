const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

//image access
//image
app.use(express.static('public'));

// //access of images
// app.use("/public",express.static('public'));

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

//newHealthPlan route
const healthcare_route = require('./routes/HealthCareRoute');
app.use('/api',healthcare_route);

//rojkharidoCategory route
const rojkharido_category_route = require('./routes/RojkharidoCategoryRoute');
app.use('/api',rojkharido_category_route);

//travel route
const travel_route = require('./routes/TravelRoute');
app.use('/api',travel_route);

//store route
const store_route = require('./routes/RojkharidoStoreRoute');
app.use('/api',store_route);

//product route
const product_route = require('./routes/RojkharidoProductRoute');
app.use('/api',product_route);

//restaurant route
const restaurant_route = require('./routes/RestaurantRoute');
app.use('/api',restaurant_route);

//grocery route
const grocery_route = require('./routes/GroceryRoute');
app.use('/api',grocery_route);

//banner route
const banner_route = require('./routes/RojkharidoBannerRoute');
app.use('/api',banner_route);



//start server
app.listen(process.env.PORT || 1000, function () {
    console.log(`Server is ready on ${1000}`);
});