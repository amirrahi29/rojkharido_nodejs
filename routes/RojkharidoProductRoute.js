const express = require('express');
const product_route = express();

//body-parser
const bodyParser = require('body-parser');
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({ extended: true }));

//multer
const multer = require("multer");
const path = require("path");

product_route.use(express.static('public'));

//fileupload
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/RojkharidoProductImages'),function(error,success){
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
const productController = require('../controller/RojkharidoProductController');


//api
product_route.post('/addProduct',upload.array('images'),productController.addProduct);
product_route.post('/allnearestStoresProducts',productController.allnearestStoresProducts);
product_route.post('/allnearestStoresProductsPriceRange',productController.allnearestStoresProductsPriceRange);

module.exports = product_route;