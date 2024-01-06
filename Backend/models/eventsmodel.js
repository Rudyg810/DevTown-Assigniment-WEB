const mongoose = require("mongoose")
const usermodel = require("./usermodel.js")

const userschema = new mongoose.Schema({
    title:
    {
        type : String,
        required: true,
        unique: true
    },
    slug:
    {
        type:String,
        lowercase: true,
        required: true
    },
    content:
    {
        type: String,
        required: true,
    },
    writer:
    {
        type: String,
        default: "Anonymous"
    },
    
    tokentoassign:{
        type: Number,
        required:false,
        default: 50
    },
    photo:{
        data: Buffer,
        contentType: String
        
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usermodel',
        required: false
    }]

},
{
timestamp: true
})
module.exports = mongoose.model("eventsmodel",userschema)