const ProductModel = require('../model/RojkharidoProductModel');

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
    try {
        const product = await ProductModel.find();
        if (product) {

            const allProducts = [];

            for (let index = 0; index < product.length; index++) {
                allProducts.push({
                    _id: product[index]._id,
                    category_id: product[index].category_id,
                    sub_category_id: product[index].sub_category_id,
                    store_id: product[index].store_id,
                    name: product[index].name,
                    price: product[index].price,
                    weight: product[index].weight,
                    weight_type: product[index].weight_type,
                    stock_count: product[index].stock_count,
                    discount: product[index].discount,
                    tax: product[index].tax,
                    type: product[index].type,
                    image: config.BASE_URL+"RojkharidoProductImages/"+category[index].images,
                    date: product[index].date,
                });
            }

            res.status(200).send({ success: true, msg: "All products", data: allProducts });

        } else {
            res.status(200).send({ success: false, msg: "No products found!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    addProduct,
    allProducts
}