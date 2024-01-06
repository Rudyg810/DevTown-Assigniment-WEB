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
    email:{
        type: String,
        required: true,
        trim: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productmodel',
        required: false
    }],
    
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
