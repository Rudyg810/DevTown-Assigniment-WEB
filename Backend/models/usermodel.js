const  mongoose = require("mongoose")
const productmodel = require("./productmodel.js")
const userschema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },

    password:{
        type: String,
        required: true,
        trim: true
    },
    address:{
        type:String,
        required:false,
        trim:true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    products: [{
        type: Object ,
 
        required: false
    }], 
    photo:{
        data: Buffer,
        contentType: String,

    },
    role:
    {
        type: Number,
        required: false,
        default: 0
    },
    tokenn:
    {
        type: Number,
        required: false,
        default: 0
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("usermodel", userschema)
