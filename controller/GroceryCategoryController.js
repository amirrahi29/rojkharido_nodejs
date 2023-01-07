const GroceryCategoryModel = require('../model/GroceryCategoryModel');
const config = require('../config/config');

const addGroceryCategory = async (req, res) => {

    try {
        const title = req.body.title;
        const description = req.body.description;
        const grocery_category_image = req.file.filename;
        const route = req.body.route;

        const category = await GroceryCategoryModel.findOne({ "title": title });
        if (!category) {
            const categoryData = new GroceryCategoryModel({
                title: title,
                description: description,
                grocery_category_image: grocery_category_image,
                route: route,
                date: Date().toString(),
            });

            const categorySaveData = await categoryData.save();
            if (categorySaveData) {
                res.status(200).send({ success: true, msg: "Grocery Category details", data: categorySaveData });
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

const allGroceryCategory = async (req, res) => {
    try {
        const category = await GroceryCategoryModel.find();
        if (category) {

            const allCategories = [];

            for (let index = 0; index < category.length; index++) {
                allCategories.push({
                    _id: category[index]._id,
                    title: category[index].title,
                    description: category[index].description,
                    grocery_category_image: config.BASE_URL+"GroceryCategoryImages/"+category[index].grocery_category_image,
                    route: category[index].route,
                    date: category[index].date,
                });
            }

            res.status(200).send({ success: true, msg: "All Grocery Categories", data: allCategories });

        } else {
            res.status(200).send({ success: false, msg: "No categories found!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    addGroceryCategory,
    allGroceryCategory
}