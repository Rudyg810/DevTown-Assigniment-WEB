const  mongoose = require( "mongoose")

const DBconnect =  async()=>{  
  mongoose.connect("mongodb+srv://rudragupta810:<!getGFby2022>@cluster1.tsrzedf.mongodb.net/?retryWrites=true&w=majority", (err)=>{
  if(err) console.log('err') ;
  else
  console.log("Ok")
  //schema aur connect ko krne se automatically collection bn jata
  mongoose.set('strictQuery', false) 

});

}
module.exports = DBconnect





