const RojkharidoBannerModel = require('../model/RojkharidoBannerModel');
const config = require('../config/config');

const addRojkharidoBanner = async (req, res) => {

    try {
        const title = req.body.title;
        const description = req.body.description;
        const category_id = req.body.category_id;
        const rojkharido_banner_image = req.file.filename;

        const banner = await RojkharidoBannerModel.findOne({ "title": title });
        if (!banner) {

            const bannerData = new RojkharidoBannerModel({
                title: title,
                description: description,
                category_id: category_id,
                rojkharido_banner_image: rojkharido_banner_image,
                date: Date().toString(),
            });

            const bannerSaveData = await bannerData.save();
            if (bannerSaveData) {
                res.status(200).send({ success: true, msg: "Banner details", data: bannerData });
            } else {
                res.status(200).send({ success: false, msg: "Something went wrong, Please try again!" });
            }
        } else {
            res.status(200).send({ success: false, msg: "This banner is already exists!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}

const allRojkharidoBanner = async (req, res) => {

    try {
        const banner = await RojkharidoBannerModel.find();
        if (banner) {

            const allbanners = [];

            for (let index = 0; index < banner.length; index++) {
                allbanners.push({
                    _id: banner[index]._id,
                    title: banner[index].title,
                    description: banner[index].description,
                    category_id: banner[index].category_id,
                    rojkharido_banner_image: config.BASE_URL + "RojkharidoBannerImages/" + banner[index].rojkharido_banner_image,
                    date: banner[index].date,
                });
            }

            res.status(200).send({ success: true, msg: "All Rojkharido Banners", data: allbanners });

        } else {
            res.status(200).send({ success: false, msg: "No categories found!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }

}

module.exports = {
    addRojkharidoBanner,
    allRojkharidoBanner
}