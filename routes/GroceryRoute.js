const express = require('express');
const grocery_route = express();

//body-parser
const bodyParser = require('body-parser');
grocery_route.use(bodyParser.json());
grocery_route.use(bodyParser.urlencoded({ extended: true }));

//file upload
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/GroceryCategoryImages'),function(error,success){
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
const groceryCategoryController = require('../controller/GroceryCategoryController');


//api
grocery_route.post('/addGroceryCategory',upload.single('grocery_category_image'), groceryCategoryController.addGroceryCategory);
grocery_route.get('/allGroceryCategory', groceryCategoryController.allGroceryCategory);

module.exports = grocery_route;