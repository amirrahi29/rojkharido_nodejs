const mongoose = require("mongoose");

const GroceryCategoryModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    grocery_category_image:{
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

module.exports = mongoose.model("GroceryCategory", GroceryCategoryModel);