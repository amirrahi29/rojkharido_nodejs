const RojkharidoCategoryModel = require('../model/RojkharidoCategoryModel');
const config = require('../config/config');

const addRojkharidoCategory = async (req, res) => {

    try {
        const title = req.body.title;
        const description = req.body.description;
        const rojkharido_category_image = req.file.filename;

        const category = await RojkharidoCategoryModel.findOne({ "title": title });
        if (!category) {
            const categoryData = new RojkharidoCategoryModel({
                title: title,
                description: description,
                rojkharido_category_image: rojkharido_category_image,
                date: Date().toString(),
            });

            const categorySaveData = await categoryData.save();
            if (categorySaveData) {
                res.status(200).send({ success: true, msg: "Rojkharido Category details", data: categorySaveData });
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

const allRojkharidoCategory = async (req, res) => {

    try {
        const category = await RojkharidoCategoryModel.find();
        if (category) {

            const allCategories = [];

            for (let index = 0; index < category.length; index++) {
                allCategories.push({
                    _id: category[index]._id,
                    title: category[index].title,
                    description: category[index].description,
                    rojkharido_category_image: config.BASE_URL+"RojkharidoCategoryImages/"+category[index].rojkharido_category_image,
                    date: category[index].date,
                });
            }

            res.status(200).send({ success: true, msg: "All Rojkharido Categories", data: allCategories });

        } else {
            res.status(200).send({ success: false, msg: "This category is already exists!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}

module.exports = {
    addRojkharidoCategory,
    allRojkharidoCategory
}