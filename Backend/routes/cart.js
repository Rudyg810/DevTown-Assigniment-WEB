const   express  =require(   "express")
const  {buyProduct, boughtProducts, soldProducts} =require(   "../controller/cartcontroler.js")
const { admincheck, requireSignin } =require(   "../middlewares/authmiddleware.js")

const cartrouter = express.Router()

cartrouter.post("/buy/:slug",requireSignin, buyProduct)

cartrouter.post("/bought-products", requireSignin,boughtProducts);
cartrouter.get("/sold-products",soldProducts)

module.exports = cartrouter