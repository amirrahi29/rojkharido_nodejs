const express = require('express');
const restaurant_route = express();

//body-parser
const bodyParser = require('body-parser');
restaurant_route.use(bodyParser.json());
restaurant_route.use(bodyParser.urlencoded({ extended: true }));

//file upload
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/RestaurantCategoryImages'),function(error,success){
            if(error) throw error
        });
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null, name, function(error1, success1){
            if(error1) throw error1
        });
    }
});

const upload = multer({storage:storage});


//controller
const restaurantCategoryController = require('../controller/RestaurantCategoryController');

//api
restaurant_route.post('/addRestaurantCategory',upload.single('restaurant_category_image'), restaurantCategoryController.addRestaurantCategory);
restaurant_route.get('/allRestaurantCategory', restaurantCategoryController.allRestaurantCategory);

module.exports = restaurant_route;