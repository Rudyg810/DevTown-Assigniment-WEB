const slugify = require("slugify")
const productmodel = require("../models/productmodel.js")
const fs = require("fs")
const cateogarymode = require("../models/cateogarymode.js")
const usermodel = require("../models/usermodel.js")

const Createproductcontroller = async(req,res) =>{
try{
    //formidable ka istemaal to get working url photos not just any strings
    const {name, description,price, cateogary, quantity  } = req.fields
    const {photo} = req.files
    console.log(req.fields)
    switch(true){
        case !name:
          console.log(1)  
          return res.status(400).send({ error: "Name is required"})
        case !description:
          console.log(2)  
          return res.status(400).send({ error: "description is required"}) 
        case !price:
          console.log(3)  
          return res.status(400).send({ error: "price is required"}) 
        case !cateogary:
          console.log(4)  
          return res.status(400).send({ error: "cateogary is required"}) 
        case !quantity:
            console.log(5)  
            return res.status(400).send({ error: "quantity is k required"}) 
        
       }
        const foundCategory = await cateogarymode.findById(cateogary);
console.log(foundCategory)
        if (!foundCategory) {
          return res.status(404).send({ error: "Category not found" });
        }
      
        const categoryId = foundCategory._id;
      
        const product = new productmodel({...req.fields, cateogary:categoryId, slug: slugify(name)})
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        
        await product.save()
        res.status(200).send({
            success: true,
            product,
            message:"Product created"
        })
}
catch(error){
  console.log(error)
    res.status(400).send({
        success: false,
        error,
        message:"Error in product"
    })
}
}


const buy = async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const user = await usermodel.findOne({ email: email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Wrong userId",
      });
    }

    const product = await productmodel.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(400).send({
        success: false,
        message: "Wrong product",
      });
    }
console.log(user.tokenn, product.price)
    if (user.tokenn < product.price) {
console.log(user.tokenn, product.price)

      return res.status(400).send({
        success: false,
        message: "Insufficient Balance ",
      });
    }

    // The code below executes only if the conditions above are false
    user.tokenn -= product.price;


    product.quantity -= 1;
    user.products.push(product);
   await user.save();
    // Save the updated user and product
 console.log(user.tokenn, product.price)

    return res.status(200).send({
      success: true,
      message: "Successfully joined the event",
      user: user,
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error,
      message: error.message,
    });
  }
};






const Updateproductcontroller = async(req,res) =>{
    try{        

        //formidable ka istemaal to get working url photos not just any strings
        const {name1,name, description,price, cateogary, quantity } = req.fields
        const {photo} = req.files
        console.log(req.body)
        switch(true){
            case !name1:
              console.log(1)  
              return res.status(400).send({ error: "Pred Prod is required"})
                case !name:
                   console.log(2)
                  return res.status(404).send({ error: "Name is required"})  
                case !description:
                console.log(3)
                  return res.status(404).send({ error: "description is required"}) 
            case !price:
              console.log(4)  
              return res.status(404).send({ error: "price is required"}) 
            case !cateogary:
              console.log(5)  
              return res.status(404).send({ error: "cateogary is required"}) 
            case !quantity:
              console.log(6)  
              return res.status(404).send({ error: "quantity is required"}) 
              
            }
            const pro = await productmodel.findOne({name: name1 }); // Find the pro by name
  
            if (!pro) {
              console.log("nallla")
              return res.status(404).send({
                success: false,
                message: "Product not found",
              });
            }

            const product = await productmodel.findByIdAndUpdate(pro._id, {...req.fields, slug: slugify(name)},{new: true}  )
            if(photo){
                product.photo.data = fs.readFileSync(photo.path)
                product.photo.contentType = photo.type
            }            
            await product.save()
            res.status(200).send({
                success: true,
                product,
                message:"Product updates"
            })
    }
    catch(error){
      console.log(error)
      console.log(error)
        res.status(201).send({
            success: false,
            error,
            message:"Error in product"
        })
    }}
    



    const deleteproduct = async (req, res) => {
      try {console.log(req.body)
        const { name } = req.body;
        
        const pro = await productmodel.findOne({ name }); // Find the pro by name
      console.log(name)
        if (!pro) {
    
          return res.status(500).send({
            success: false,
            message: "Product not found",
          });
        }
    
        await productmodel.findByIdAndDelete(pro._id);
        res.status(200).send({
          success: true,
          message: "Category delted Successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error: error,
          message: "Error while deleting category",
        });
      }
    };

 


const productcontroller = async (req,res) =>{
  try{
      const product = await productmodel.find({}).select("-photo").sort({quantity:-1}) //-1 for negative sort
      
      res.status(200).send({ 
        success: true,
        message: true,
        message: "All cateogaries",
        product
      })
  }
  catch(error){
    console.log(error)
      res.status(500).send({
          message: "Error product",
          error,
          success: false
      })
  }
}


const firstproductcontroller = async (req,res) =>{
  try{
      const allproduct = await productmodel.find({}).select("-photo")//-1 for negative sort
      if(product.length<5){
          const requiredproduct = allproduct;
      }
      else{
        const requiredproduct = allproduct.slice(0, 6)
      }
      res.status(200).send({ 
        success: true,
        message: "All cateogaries",
        "product": requiredproduct
      })
  }     
  catch(error){
    console.log(error)
      res.status(500).send({
          message: "Error product",
          error,
          success: false
      })
  }
}


const getpro = async (req,res) =>{
  try{
    const category = await cateogarymode.findOne({ slug: req.params.slug });

    if (!category) {
      // If category is not found, return an appropriate response
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Now that you have the category, use its id to search for products
    const products = await productmodel.find({ cateogary: category._id }).select("-photo");

      res.status(200).send({ 
        success: true,
        message: "All pro",
        "product":products
      })
  }
  catch(error){
    console.log(error)
      res.status(500).send({
          message: "Error product",
          error,
          success: false
      })
  }
}


const getproofuser = async (req,res) =>{
  try{
    console.log(req.body)
    const {email} = req.body
    const user = await usermodel.findOne({ email: email });

    if (!user) {
      // If user is not found, return an appropriate response
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).send({ 
      success: true,
      message: "All pro",
      "product":user.products
    })

  } 
  catch(error){
    console.log(error)
      res.status(500).send({
          message: "Error product",
          error,
          success: false
      })
  }
}





const singleproductcontroller = async (req, res) => {
  try {
    const product = await productmodel.findOne({ slug: req.params.slug });
    const category_name = await cateogarymode.findById(product.cateogary);

    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      product,
      category_name
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

const productphotocontroller = async (req, res) => {
  try {
      const product = await productmodel.findById(req.params.pid).select("photo")
      
      if(product.photo.data){
        res.set("Content-type", product.photo.contentType);
        
          res.status(200).send(product.photo.data);
      }
      ;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error,
      message: "Error while photo of product",
    });
  }
};
const productfilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.cateogary = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productmodel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};
const searchcontroller = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productmodel.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

module.exports = {firstproductcontroller,getproofuser,buy,getpro, searchcontroller, productfilter, productphotocontroller, deleteproduct, singleproductcontroller, productcontroller, Createproductcontroller, Updateproductcontroller}