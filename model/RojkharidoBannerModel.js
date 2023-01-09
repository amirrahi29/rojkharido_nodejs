const mongoose = require("mongoose");

const RojkharidoBannerModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    rojkharido_banner_image:{
        type:String,
        required:true
    },
    date: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("rojkharidoBanner", RojkharidoBannerModel);