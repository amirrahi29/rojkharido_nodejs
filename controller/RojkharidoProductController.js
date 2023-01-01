const ProductModel = require('../model/RojkharidoProductModel');

const addProduct = async (req,res)=>{

    const category_id = req.body.category_id;
    const store_id = req.body.store_id;
    const name = req.body.name;
    const price = req.body.price;
    const stock_count = req.body.stock_count;
    const discount = req.body.discount;
    const tax = req.body.tax;
    const type = req.body.type;
    const date = Date().toString();

    try {
        var arrImages = [];
        for(let i = 0; i<req.files.length; i++){
            arrImages[i] = req.files[i].filename;
        }

        var product = new ProductModel({
            category_id:category_id,
            store_id:store_id,
            name:name,
            price:price,
            stock_count:stock_count,
            discount:discount,
            tax:tax,
            type:type,
            date:date,
            images:arrImages
        });

        const productData = await product.save();
        res.status(200).send({success:true,msg:"Product details",data:productData});
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

module.exports = {
    addProduct
}