const mongoose= require("mongoose")



const DatabaseConnect = async ()=>{
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.DATABASE, ()=>{    console.log("Database Connect Succesfully") })
    } catch (error) {
        console.log(error)
    }
  
}

module.exports = DatabaseConnect