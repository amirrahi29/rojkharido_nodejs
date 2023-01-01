const mongoose = require("mongoose");

const RojkharidoProductModel = mongoose.Schema({
    category_id: {
        type: String,
        required: true
    },
    store_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock_count: {
        type: String,
        required: true //number of products available in stocks 
    },
    discount: {
        type: String,
        required: true
    },
    tax: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: '0' //0 means non-veg
    },
    images:{
        type:Array,
        required:true,
        validate:[arrayLimit,'You can pass only 5 product images!']
    },
    date: {
        type: String,
        required: true
    },
});

function arrayLimit(val){
    return val.length<=5;
}

module.exports = mongoose.model("RojkharidoProduct", RojkharidoProductModel);