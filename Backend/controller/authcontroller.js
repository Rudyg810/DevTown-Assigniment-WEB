const usermodel = require("../models/usermodel.js")
const { comparePassword, hashPassword } = require("./../utils/authhelper.js")
const JWT = require("jsonwebtoken")


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
    const token = await JWT.sign({ _id: user._id }, "HGFHGEAD1212432432", {
      expiresIn: "7d",
    });
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
    const { user, password } = req.body;
    //validation
    if ( !password || !user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Auth",
      });
    }
    
    //check user

    const user1 = await usermodel.findand({ email });
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



module.exports = {  registerController, loginController}