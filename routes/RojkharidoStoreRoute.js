const express = require('express');
const store_route = express();

//body-parser
const bodyParser = require('body-parser');
store_route.use(bodyParser.json());
store_route.use(bodyParser.urlencoded({ extended: true }));

//file upload
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/RojkharidoStroreImages'),function(error,success){
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
const rojkharidoStoreController = require('../controller/RojkharidoStoreController');


//api
store_route.post('/addRojkharidoStore',upload.single('storeImage'), rojkharidoStoreController.addRojkharidoStore);
store_route.get('/allRojkharidoStore', rojkharidoStoreController.allRojkharidoStore);
store_route.post('/updateStoreEmailOrPhoneVerified', rojkharidoStoreController.updateStoreEmailOrPhoneVerified);
store_route.post('/nearestRojkharidoStore', rojkharidoStoreController.nearestRojkharidoStore);
store_route.post('/rojkharidoStoreDetails', rojkharidoStoreController.rojkharidoStoreDetails);

module.exports = store_route;