const  express = require("express")
const  router = express.Router()
const  {admincheck, requireSignin} = require("../middlewares/authmiddleware.js")
const  {addresscontroler,registerController, loginController, gettoken, photoUpload, userphotocontroller, getAllUsersWithRoleZero, deleteUser} = require("../controller/authcontroller.js")
const formidable_express= require("express-formidable")

router.post("/register", registerController );
router.post("/address",requireSignin, addresscontroler );
router.post("/login", loginController)
router.get("/user-photo/:pid",formidable_express(), userphotocontroller)
router.get("/users", getAllUsersWithRoleZero)
router.delete("/delete/:id", deleteUser)

router.post("/photo/:id",formidable_express(), photoUpload)
router.post("/token", gettoken)
router.get("/test", requireSignin, admincheck,(req,res)=>
{
    res.json({
        message: "Gotccha"
    })
})
router.get("/Dashboard", requireSignin, (req,res) =>{
    res.status(200).send({ok:true})
} )

router.get("/admin", requireSignin, admincheck, (req,res) =>{
    res.status(200).send({ok:true})
} )
module.exports= router