const { imageUploadUtil, imageDeleteUtil } = require('../../helpers/cloudinary');
const Product = require('../../models/Product');

const handleImageUpload = async(req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const fileUrl = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(fileUrl);
        console.log(result,"from cloudinary")

        res.json({
            success: true,
            data: result
        })
    }catch(error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Error occured.'
        })
    }
}

const handleDeleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    console.log(req.body);
    const result = await imageDeleteUtil(public_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
}

//add a new product
const addProduct = async(req,res)=>{
    try {
        const {
            images,
            title,
            description,
            category,
            brand, 
            price, 
            salePrice, 
            totalStock,
        } = req.body;
        const newlyCreatedProduct = new Product({
            images,
            title,
            description,
            category,
            brand, 
            price, 
            salePrice, 
            totalStock,
        })

        await newlyCreatedProduct.save();
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error occured",
        })
    }
}

//fetch all products
const fetchAllProducts = async(req,res)=>{
    try {
        const listOfProducts = await Product.find({});
        res.status(200).json({
            success: true,
            data: listOfProducts,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error occured",
        })
    }
}

//edit a product
const editProduct = async(req,res)=>{
    try {
        const {id} = req.params
        const {
            image,
            title,
            description,
            category,
            brand, 
            price, 
            salePrice, 
            totalStock,
        } = req.body;
        const findProduct = await Product.findById(id);
        if(!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price || findProduct.price;
        findProduct.salePrice = salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.image = image || findProduct.image;

        await findProduct.save();
        res.status(200).json({
            success: true,
            data: findProduct,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error occured",
        })
    }
}

//delete a product
const deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error occured",
        })
    }
}

module.exports = {
    handleImageUpload,
    handleDeleteImage,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct,    
}