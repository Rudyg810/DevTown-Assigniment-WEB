const   express = require("express")
const   mongoose = require("mongoose")
const   morgan = require("morgan")
const   router = require("./routes/auth.js")
const   bcrypt = require("bcryptjs")
const socketIO = require('socket.io');
const http = require('http');

//dotenv.config();
const   cateogaryrouter = require ("./routes/cateogaryrouter.js")
const  server = express() 
const app = http.createServer(server);
const io = socketIO(app);
const   cors = require("cors")
const productrouter = require("./routes/productroute.js")
const formidable_express = require("express-formidable")
const   jsonwebtoken = require("jsonwebtoken")
const eventrouter = require("./routes/eventroute.js")
const cartrouter = require("./routes/cart.js")
mongoose.connect("mongodb+srv://rudragupta810:57G1svxAvz3qlizP@cluster0.grc0uts.mongodb.net/?retryWrites=true&w=majority")
server.use(express.json())
server.use(cors())
//dev not made yet
server.use(morgan("dev"))
server.use("/api/v1/auth", router)
server.use("/api/v1/cateogary", cateogaryrouter)
server.use("/api/v1/product", productrouter)
server.use("/api/v1/event", eventrouter)
server.use("/api/v1/cart", cartrouter)
 
server.listen(8080, ()=>{
    console.log("serverl listening"+"8080")
})    


