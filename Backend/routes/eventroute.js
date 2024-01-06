const   express  =require(   "express")
const eventsmodel = require("../models/eventsmodel.js")
const { admincheck, requireSignin } =require(   "../middlewares/authmiddleware.js")
const  {authenticateparticipant ,createevents,getUsersInEvent,getUserEvents, updateevent,deleteevent, eventcontroller, joinevent,singleeventcontroller, eventphotocontroller } =require(   "../controller/eventscontroller.js")
const fs = require("fs")
const formidable_express= require("express-formidable")
const eventrouter = express.Router()

eventrouter.post("/create-event", requireSignin, admincheck, formidable_express(), createevents)

eventrouter.put("/update-event/:id", requireSignin, admincheck, formidable_express(), updateevent);
eventrouter.get("/event", eventcontroller)
eventrouter.get("/single-event/:slug", singleeventcontroller)
eventrouter.get("/event-photo/:pid",formidable_express(), eventphotocontroller)
eventrouter.post("/join-event/:slug", requireSignin, joinevent)
eventrouter.delete("/delete-event/:slug", requireSignin, deleteevent)
eventrouter.get("/users-in-event/:slug", requireSignin, getUsersInEvent)
eventrouter.get("/events-of-user", requireSignin, getUserEvents)
eventrouter.post("/authenticate-user/:slug", requireSignin,admincheck, authenticateparticipant)
module.exports = eventrouter