const slugify = require("slugify")
const eventsmodel = require("../models/eventsmodel")
const fs = require('fs')
const usermodel = require("../models/usermodel")

const createevents = async(req, res) =>{
    try{
        const {title,slug,content,writer,tokentoassign} = req.fields
        const {photo} = req.files
        switch(true){
            case !title:
                return res.status(201).send({ error:"Title required"})
            case !content:
                return res.status(201).send({ error:"Title required"})
            case !writer:
                return res.status(201).send({ error:"Title required"})
            case !photo && photo.size > 1000000 :
                return res.status(201).send({ error:"Title required"}) 
        }
        const event = new eventsmodel({...req.fields, slug: slugify(title)})
        if(photo){
            event.photo.data  = fs.readFileSync(photo.path)
            event.photo.contentType = photo.type
        }
        await event.save()
        res.status(200).send({
            success: true,
            event, message: "event created"
        })
    }
    catch(error){
        res.status(201).send({
            success: false,
            error,
            message: "Error in creating events"
        })
    }
}
const updateevent = async (req, res) => {
  try{
    //formidable ka istemaal to get working url photos not just any strings
    const {title, content,writer, tokentoassign } = req.fields
    const {photo} = req.files
    switch(true){
        case !title:
            return res.status(201).send({ error: "title is required"})
        case !content:
            return res.status(201).send({ error: "content is required"}) 
        case !writer:
            return res.status(201).send({ error: "writer is required"}) 
        case !tokentoassign:
            return res.status(201).send({ error: "tokentoassign is required"}) 
        case !photo && photo.size > 1000000:
            return res.status(201).send({ error: "photo is invalid"}) 
        }
        const event = await eventsmodel.findByIdAndUpdate(req.params.id, {...req.fields, slug: slugify(title)},{new: true}  )
        if(photo){
            event.photo.data = fs.readFileSync(photo.path)
            event.photo.contentType = photo.type
        }            
        await event.save()
        res.status(200).send({
            success: true,
            event,
            message:"event updates"
        })
}
catch(error){
  console.log(error)
    res.status(201).send({
        success: false,
        error,
        message:"Error in event"
    })
}}


const eventcontroller = async (req,res) =>{
    try{
        const event = await eventsmodel.find({}).select("-photo") 
        
        res.status(200).send({
          success: true,
          message: "All events here",
          event
        })
    }
    catch(error){
        res.status(500).send({
            message: "Error event contorller",
            error,
            success: false
        })
    }
  }
  const singleeventcontroller = async (req, res) => {
    try {
      const event = await eventsmodel.findOne({ slug: req.params.slug });
  
      res.status(200).send({
        success: true,
        message: "Get SIngle event SUccessfully",
        event,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While getting Single event",
      });
    }
  };
  const deleteevent = async (req, res) => {
    try {
      const { id } = req.params;
      await eventsmodel.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: id +" event delted Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: error,
        message: "Error while deleting event",
      });
    }
  };
  const eventphotocontroller = async (req, res) => {
    try {
        const event = await eventsmodel.findById(req.params.pid).select("photo")
        
        if(event.photo.data){
            res.set("Content-type", event.photo.contentType)
        
            res.status(200).send(event.photo.data)
        };
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: error,
        message: "Error while photo of product",
      });
    }
  };

  const joinevent = async(req,res) =>{
    try{
        const {emailid} = req.body;
        const user = await usermodel.findOne({email:emailid});

        if(!user){
          return "Wrong userId"
        }

        const event = await eventsmodel.findOne({ slug: req.params.slug });
        if(!event){
          return "Wrpng event"
        }
        const isAlreadyParticipant = event.participants.includes(user._id);

        if (isAlreadyParticipant) {
          return res.status(400).send({
            success: false,

            message: "User already participated in this event"
          });
        }
      
        // If the user is not already a participant, add the user ID to the array
        event.participants.push(user._id);
      
        // Save the updated event
        await event.save();
          res.status(200).send({
            success: true,
            message: "Successfully joined the event",
            user:user,
            event: event // Sending the updated event back in the response
          });
        
    }
    catch(error){
      res.status(400).send({
        success:false,
        error: error,
        message: error.message
      })
    }
  }
  const getUsersInEvent = async (req, res) => {
    try {
      const event = await eventsmodel.findOne({ slug: req.params.slug });
  
      if (event) {
        // Assuming participants in the event model contains user IDs
        const participantIds = event.participants;
  
        // Fetch users based on participant IDs
        const users = await usermodel.find({ _id: { $in: participantIds } });
  
        res.status(200).send({
          success: true,
          users: users,
          message: "Users in the event"
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Event not found"
        });
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        error: err,
        message: "Failed to fetch users in the event"
      });
    }
  };
  const getUserEvents = async (req, res) => {
    try {
      const { email } = req.body;
      const user = usermodel.findOne({email:email})
      const events = await eventsmodel
        .find({ participants: { $in: [user._id] } })
        .populate('participants'); // Populate the 'participants' field in events
  
      res.status(200).send({
        success: true,
        events: events,
        message: "Events for the user"
      });
    } catch (err) {
      res.status(400).send({
        success: false,
        error: err,
        message: "Failed to fetch events for the user"
      });
    }
  };
  const authenticateparticipant = async (req, res) => {
    try {
      const { users } = req.body;
      const array = [];
      const event = await eventsmodel.findOne({slug: req.params.slug})
      for (let user of users) {
        const foundUser = await usermodel.findOne({ email: user });
        array.push(foundUser);
        if (foundUser) {
          foundUser.tokenn = event.tokentoassign;
          await foundUser.save(); // Save the updated token for each user
        }
      }
      res.status(200).send({
        success: true,
        tokenupdated: array,
        message: "Events for the user"
      });
    } catch (err) {
      res.status(400).send({
        success: false,
        error: err,
        message:err.message
      });
    }
  };
    
  module.exports = {authenticateparticipant ,createevents,getUsersInEvent,getUserEvents, updateevent,deleteevent, eventcontroller, joinevent,singleeventcontroller, eventphotocontroller }