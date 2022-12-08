const express = require('express');
const rojkharido_category_route = express();

//body-parser
const bodyParser = require('body-parser');
rojkharido_category_route.use(bodyParser.json());
rojkharido_category_route.use(bodyParser.urlencoded({ extended: true }));

//file upload
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/RojkharidoCategoryImages'),function(error,success){
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
const rojkharidoCategoryController = require('../controller/RojkharidoCategoryController');


//api
rojkharido_category_route.post('/addRojkharidoCategory',upload.single('rojkharido_category_image'), rojkharidoCategoryController.addRojkharidoCategory);
rojkharido_category_route.get('/allRojkharidoCategory', rojkharidoCategoryController.allRojkharidoCategory);

module.exports = rojkharido_category_route;