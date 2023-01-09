const express = require('express');
const rojkharido_banner_route = express();

//body-parser
const bodyParser = require('body-parser');
rojkharido_banner_route.use(bodyParser.json());
rojkharido_banner_route.use(bodyParser.urlencoded({ extended: true }));

//file upload
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/RojkharidoBannerImages'),function(error,success){
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
const rojkharidoBannerController = require('../controller/RojkharidoBannerController');


//api
rojkharido_banner_route.post('/addRojkharidoBanner',upload.single('rojkharido_banner_image'), rojkharidoBannerController.addRojkharidoBanner);
rojkharido_banner_route.post('/allRojkharidoBanner', rojkharidoBannerController.allRojkharidoBanner);

module.exports = rojkharido_banner_route;