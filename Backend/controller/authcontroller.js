const { comparePassword, hashPassword } = require("./../utils/authhelper.js")
const slugify = require("slugify")
const productmodel = require("../models/productmodel.js")
const fs = require("fs")
const JWT = require('jsonwebtoken'); // Import jsonwebtoken library

const usermodel = require("../models/usermodel.js")
const registerController = async (req, res) => {
  try {
    const { name,password, email } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
  
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!email) {
      return res.send({ message: "email no is Required" });
    }
   

    //check user
    const exisitingUser = await usermodel.findOne({ email });
    //exisiting user
    
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    } 

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new usermodel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await usermodel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await usermodel.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully',success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const addresscontroler = async (req, res) => {
  try {
    const { email, address } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not found",
      });
    }

    user.address = address;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Address updated",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating address",
      error: error.message, // Sending only the error message for simplicity
    });
  }
};const photoUpload = async (req, res) => {
  try {
  
    const { photo } = req.files;

    // Check if the user exists
    const user = await usermodel.findById(req.params.id); // Assuming your parameter is userId
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found',
      });
    }
    console.log(user)
    if(photo){
      user.photo.data = fs.readFileSync(photo.path)
      user.photo.contentType = photo.type
  }      
    await user.save();

    res.status(200).send({
      success: true,
      user,
      message: 'Photo uploaded and user updated',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
// Controller to get all users with role 0
const getAllUsersWithRoleZero = async (req, res) => {
  try {
      // Use the UserModel to find all users with role 0
      const users = await usermodel.find({ role: 0 });

      // Respond with the list of users
      res.status(200).json({ users });
  } catch (error) {
      // Handle errors
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const userphotocontroller = async (req, res) => {
  try {
      const user = await usermodel.findById(req.params.pid).select("photo")
      
      if(user.photo.data){
        res.set("Content-type", user.photo.contentType);
        
          res.status(200).send(user.photo.data);
      }
      ;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error,
      message: "Error while photo of user",
    });
  }
};

const gettoken = async(req,res) =>
{
  try{
      const {email} = req.body;
      const response = await usermodel.findOne({email:email})
      const token = response.tokenn
      console.log(response.tokenn)
      if(response){
        res.status(200).send({
          success:true,
          "token":token
        })
      }
  }
  catch(error)
{
  res.status(400).send({
    success:false,
    error,
    message:error.message
  })
}}


//POST LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, "HGFHGEAD1212432432");
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tokenn : user.tokenn,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(201).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

const updateauth = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if ( !password || !email) {
      return res.status(404).send({
        success: false,
        message: "Invalid Auth",
      });
    }
    
    //check user

    const user = await usermodel.findand({ email });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, "HGFHGEAD1212432432", {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "update successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tokenn : user.tokenn,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(201).send({
      success: false,
      message: "Error in update",
      error,
    });
  }
};



module.exports = {deleteUser,getAllUsersWithRoleZero,userphotocontroller,photoUpload,gettoken,addresscontroler,  registerController, loginController}