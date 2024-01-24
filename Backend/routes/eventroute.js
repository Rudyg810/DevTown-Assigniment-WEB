const   express  =require(   "express")
const eventsmodel = require("../models/eventsmodel.js")
const { admincheck, requireSignin } =require(   "../middlewares/authmiddleware.js")
const  {sineventcontroller,authenticateparticipant ,createevents,getUsersInEvent,getUserEvents, updateevent,deleteevent, eventcontroller, joinevent,singleeventcontroller, eventphotocontroller } =require(   "../controller/eventscontroller.js")
const fs = require("fs")
const formidable_express= require("express-formidable")
const eventrouter = express.Router()

eventrouter.post("/create-event",requireSignin, admincheck, formidable_express(), createevents)

eventrouter.post("/update-event",requireSignin,admincheck,  formidable_express(), updateevent);
eventrouter.get("/event", eventcontroller)
eventrouter.get("/getfirstevent", sineventcontroller)
eventrouter.get("/single-event/:slug", singleeventcontroller)
eventrouter.get("/event-photo/:pid",formidable_express(), eventphotocontroller)
eventrouter.post("/join-event/:slug", requireSignin, joinevent)
eventrouter.post("/delete-event", requireSignin,admincheck, deleteevent)
eventrouter.get("/users-in-event/:slug", requireSignin, getUsersInEvent)
eventrouter.post("/events-of-user", getUserEvents)
eventrouter.post("/authenticate-user/:slug", requireSignin,admincheck, authenticateparticipant)
module.exports = eventrouter