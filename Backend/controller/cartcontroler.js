const usermodel = require("../models/usermodel.js")
const {deletecateogary, singlecateogarycontroller, cateogarycontroller, CreateCateogarycontroller, UpdateCateogarycontroller} = require("../models/cateogarymode.js")
const {searchcontroller, productfilter, productphotocontroller, deleteproduct, singleproductcontroller, productcontroller, Createproductcontroller, Updateproductcontroller} = require("../models/productmodel.js")
const JWT = require("jsonwebtoken")
const productmodel = require("../models/productmodel.js")

const buyProduct = async (req, res) => {
    try {
      console.log(1)
      const { email } = req.body;
      // Find product based on the slug
      const product = await productmodel.findOne({ slug:req.params.slug });
  
      // Find user based on the email
      const user = await usermodel.findOne({ email:email });
  
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found"
        });
      }
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found"
        });
      }
  
      if (user.tokenn >= product.price) {
        user.tokenn -= product.price;
  
        // Push product ID into user's products array
        user.products.push(product._id);
  
        // Save updated user
        await user.save();
  
        res.status(200).send({
          success: true,
          message: "Purchase successful",
          user: user // Sending the updated user back in the response
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Insufficient balance"
        });
      }
    } catch (err) {
      res.status(500).send({
        success: false,
        error: err.message,
        message: "Failed to process the purchase"
      });
    }
  };
  
  const soldProducts = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user based on the email
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found"
        });
      }
  
      // Find products owned by the user using populate method
      const products = await ProductModel.find({ owner: user._id }).populate('owner');
  
      res.status(200).send({
        success: true,
        message: "Products owned by the user",
        products: products
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        error: err.message,
        message: "Failed to fetch products owned by the user"
      });
    }
  };

  
  const boughtProducts = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user based on the email
      const user = await usermodel.findOne({ email });
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found"
        });
      }
  
      // Fetch products bought by the user
      const boughtProducts = await productmodel.find({ _id: { $in: user.products } });
  
      res.status(200).send({
        success: true,
        message: "Products bought by the user",
        products: boughtProducts
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        error: err.message,
        message: "Failed to fetch bought products"
      });
    }
  };
  

module.exports = {
    buyProduct, boughtProducts, soldProducts
}