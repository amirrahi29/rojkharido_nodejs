const ProductModel = require('../model/RojkharidoProductModel');
const RojkharidoStoreModel = require('../model/RojkharidoStoreModel');
const config = require('../config/config');

const addProduct = async (req,res)=>{

    const category_id = req.body.category_id;
    const sub_category_id = req.body.sub_category_id;
    const store_id = req.body.store_id;
    const name = req.body.name;
    const price = req.body.price;
    const stock_count = req.body.stock_count;
    const discount = req.body.discount;
    const tax = req.body.tax;
    const weight = req.body.weight;
    const weight_type = req.body.weight_type;
    const date = Date().toString();

    try {

        const myProduct = await ProductModel.findOne({ "name": name });
        if(!myProduct){

        var arrImages = [];
        for(let i = 0; i<req.files.length; i++){
            arrImages[i] = req.files[i].filename;
        }

        var product = new ProductModel({
            category_id:category_id,
            sub_category_id:sub_category_id,
            store_id:store_id,
            name:name,
            price:price,
            weight:weight,
            weight_type:weight_type,
            stock_count:stock_count,
            discount:discount,
            tax:tax,
            date:date,
            images:arrImages
        });

        const productData = await product.save();
        res.status(200).send({success:true,msg:"Product details",data:productData});
    }else{
        res.status(200).send({success:false,msg:"This product is already exists!"});
    }
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

const allProducts = async (req, res) => {

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const maxDistance = req.body.maxDistance;
    const type = req.body.type;
    const limit = req.body.limit;

    try {
        var sendData = [];

        let storeData = await RojkharidoStoreModel.aggregate([
            {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                distanceField: "distance",
                maxDistance: maxDistance * 1609,
                spherical: true
            }
            }
        ]).limit(limit);

        if(storeData.length>0){
            
            for(let i = 0; i<storeData.length; i++){
                if(storeData[i].storeType === type){
                var productData = [];
                var store_id = storeData[i]['_id'].toString();
                var productPro = await ProductModel.find({store_id:store_id});
                if(productPro.length>0){
                    for(let j = 0; j<productPro.length; j++){
                        productData.push({
                            _id: productPro[j]._id,
                            category_id: productPro[j].category_id,
                            sub_category_id: productPro[j].sub_category_id,
                            store_id: productPro[j].store_id,
                            name: productPro[j].name,
                            price: productPro[j].price,
                            weight: productPro[j].weight,
                            weight_type: productPro[j].weight_type,
                            stock_count: productPro[j].stock_count,
                            discount: productPro[j].discount,
                            tax: productPro[j].tax,
                            type: productPro[j].type,
                            storeName: storeData[i]['storeName'],
                            image: config.BASE_URL+"RojkharidoProductImages/"+productPro[j].images,
                            date: productPro[j].date,
                        });
                    }
                }
                sendData.push({
                    "store":storeData[i]['storeName'],
                    "product":productData
                });
              }
            }
            res.status(200).send({success:true,msg:"Product Details",data:sendData});

        }else{
            res.status(200).send({success:false,msg:"No Products!"});
        }
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

module.exports = {
    addProduct,
    allProducts
}