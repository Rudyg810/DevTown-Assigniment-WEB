const slugify = require("slugify")
const cateogarymode = require("../models/cateogarymode.js")
const usermodel = require("../models/usermodel.js")

const CreateCateogarycontroller = async(req,res) =>{
try{
  console.log(req.body)
    const {name} = req.body
    if(!name){
      console.log('error')  
      return res.status(400).send({message:"Name is required"})
    }
    const existingCateogary = await cateogarymode.findOne({name})
if(existingCateogary){
  console.log(error)  
  return res.status(400).send({
        success: false,
        message: "Cateogary already exist"
    }
)}else{        
const cateogary = await new cateogarymode({ name, slug: slugify(name) }).save();
res.status(200).send({
    success:true, 
    message: "Cateogary created",
    cateogary
})}
}
catch(error){
    res.status(201).send({
        success: false,
        error,
        message:"Error in Cateogary"
    })
}
}

//update category
const UpdateCateogarycontroller = async (req, res) => {
  try {
    const { name1,name } = req.body;
    console.log(req.body)
    const category = await cateogarymode.findOne({ name:name1 }); // Find the category by name
  
    if (!category) {
      console.log(1)
      
      return res.status(501).send({
        success: false,
        message: "Category not found",
      });
    }
  
    const categoryId = category._id; // Retrieve the ID of the found category
  
    // Update the category using its ID
    const updatedCategory = await cateogarymode.findByIdAndUpdate(
      categoryId,
      { name:name1, slug: slugify(name1) },
      { new: true }
    );
  console.log(2)
    
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.log(1)
    console.log(error);
    res.status(201).send({
      success: false,
      error,
      message:error.message,
    });
  }
};
const cateogarycontroller = async (req,res) =>{
  try{
      const cateogary = await cateogarymode.find({})
      res.status(200).send({
        success: true,
        message: true,
        message: "All cateogaries",
        cateogary
      })
  }
  catch(error){
      res.status(500).send({
          message: "Error cateogary",
          error,
          success: false
      })
  }
}
const singlecateogarycontroller = async (req, res) => {
  try {
    const category = await cateogarymode.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
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
const deletecateogary = async (req, res) => {
  try {
    const { name } = req.body;
    await cateogarymode.findByIdAndDelete(name);
    res.status(200).send({
      success: true,
      message: "Category delted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting category",
    });
  }
};

module.exports = {deletecateogary, singlecateogarycontroller, cateogarycontroller, CreateCateogarycontroller, UpdateCateogarycontroller}