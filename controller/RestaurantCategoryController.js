const RestaurantCategoryModel = require('../model/RestaurantCategoryModel');
const config = require('../config/config');

const addRestaurantCategory = async (req, res) => {

    try {
        const title = req.body.title;
        const description = req.body.description;
        const restaurant_category_image = req.file.filename;
        const route = req.body.route;

        const category = await RestaurantCategoryModel.findOne({ "title": title });
        if (!category) {
            const categoryData = new RestaurantCategoryModel({
                title: title,
                description: description,
                restaurant_category_image: restaurant_category_image,
                route: route,
                date: Date().toString(),
            });

            const categorySaveData = await categoryData.save();
            if (categorySaveData) {
                res.status(200).send({ success: true, msg: "Restaurant Category details", data: categorySaveData });
            } else {
                res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" });
            }
        } else {
            res.status(200).send({ success: false, msg: "This category is already exists!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}

const allRestaurantCategory = async (req, res) => {

    try {
        const category = await RestaurantCategoryModel.find();
        if (category) {

            const allCategories = [];

            for (let index = 0; index < category.length; index++) {
                allCategories.push({
                    _id: category[index]._id,
                    title: category[index].title,
                    description: category[index].description,
                    restaurant_category_image: config.BASE_URL+"RestaurantCategoryImages/"+category[index].restaurant_category_image,
                    route: category[index].route,
                    date: category[index].date,
                });
            }

            res.status(200).send({ success: true, msg: "All Restaurant Categories", data: allCategories });

        } else {
            res.status(200).send({ success: false, msg: "No categories found!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}

module.exports = {
    addRestaurantCategory,
    allRestaurantCategory
}