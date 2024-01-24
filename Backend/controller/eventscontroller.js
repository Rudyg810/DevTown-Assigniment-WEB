const slugify = require("slugify")
const eventsmodel = require("../models/eventsmodel")
const fs = require('fs')
const usermodel = require("../models/usermodel")
const { Console } = require("console")

const createevents = async(req, res) =>{
    try{
        const {title,content,writer,tokentoassign} = req.fields
        const {photo} = req.files
        switch(true){
            case !title:
              console.log("error1")  
              return res.status(400).send({ error:"Title required"})
            case !content:
              console.log("error2")  
              return res.status(400).send({ error:"Title required"})
            case !writer:
              console.log("error3")  
              return res.status(400).send({ error:"Title required"})
              
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
      console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: "Error in creating events"
        })
    }
}
const updateevent = async (req, res) => {
  try{       

    //formidable ka istemaal to get working url photos not just any strings
    const {name, title, content,writer, tokentoassign } = req.fields
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
          
        }
        console.log(req.fields)
        const ev = await eventsmodel.findOne({ title:name });
        if (!ev) {
          return res.status(404).send({
            success: false,
            message: "Event not found",
          });
        }
        const event = await eventsmodel.findOne({slug:ev.slug})
        event.title  = title;
        event.slug = slugify(title);
        event.content = content;
        event.writer= writer;
        event.tokentoassign = tokentoassign;
        console.log(2)
        if(photo){
            event.photo.data = fs.readFileSync(photo.path)
            event.photo.contentType = photo.type
        }            
        await event.save()
        console.log(2)
        console.log(event)
        res.status(200).send({
            success: true,
            event,
            message:"event updates"
        })
}
catch(error){
    res.status(201).send({
        success: false,
        error,
        message:"Error in event" 
    })
}}


const eventcontroller = async (req,res) =>{
    try{
        const event = await eventsmodel.find({}).select("-photo").sort({quantity:-1}) //-1 for negative sort
        
        res.status(200).send({
          success: true,
          message: "All events here",
          event
        })
    }
    catch(error){
      console.log(error)
        res.status(500).send({
            message: "Error event contorller",
            error,
            success: false
        })
    }
  }

  const sineventcontroller = async (req,res) =>{
    try{
        const event = await (await eventsmodel.find({})).splice(0,1)
        
        res.status(200).send({
          success: true,
          message: "All events here",
          "event":event
        })
    }
    catch(error){
      console.log(error)
        res.status(500).send({
            message: "Error event contorller",
            error,
            success: false
        })
    }
  }
  const singleeventcontroller = async (req, res) => {
    try {
      const event = await eventsmodel.findOne({ slug: req.params.slug }).select("-photo");
  
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
      console.log(1)
      const { name } = req.body;

      const ev = await eventsmodel.findOne({ title:name });
console.log(ev)
      if (!ev) {
        return res.status(404).send({
          success: false,
          message: "Event not found",
        });
      }


      await eventsmodel.findByIdAndDelete(ev._id);
      res.status(200).send({
        success: true,
        message: ev._id +" event delted Successfully",
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
      console.log(error)
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
      const { iD } = req.body;
  
      const events = await eventsmodel.find({});
  console.log(events.length)
      const userEvents = []; // Initialize an empty array to store user events
  
      for (const event of events) {
        // Loop through events
        if (event.participants.includes(iD)) {
          // Check if user ID is in participants array
          userEvents.push({'title' :event.title , 'id': event._id}); 
      }
      
    }
    res.status(200).send({
      success: true, 
      userEvents: userEvents,
      message: "User's events fetched successfully"
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
    
      const { email } = req.body;
      const event = await eventsmodel.findOne({slug: req.params.slug})
        const foundUser = await usermodel.findOne({ email: email });

        if (foundUser) {
console.log(foundUser.tokenn, event.tokentoassign)
          
          foundUser.tokenn += event.tokentoassign;
          
          token = foundUser.tokenn;
          console.log(foundUser.tokenn, event.tokentoassign)

           // Save the updated token for each user
           foundUser.save()
          res.status(200).send({
            success: true,
            token,
          message: "Events for the user"
          });
        }
      
      
    } catch (err) {
console.log(err.message)

      res.status(400).send({
        success: false,
        error: err,
        message:err.message
      });
    }
  };
    
  module.exports = {sineventcontroller,authenticateparticipant ,createevents,getUsersInEvent,getUserEvents, updateevent,deleteevent, eventcontroller, joinevent,singleeventcontroller, eventphotocontroller }