const mongoose = require("mongoose");

const RojkharidoCategory = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rojkharido_category_image:{
        type:String,
        required:true
    },
    route:{
        type:String,
        required:true
    },
    date: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("RojkharidoCategory", RojkharidoCategory);