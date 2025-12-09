const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const { MONGO_URI } = process.env;
        if(!MONGO_URI) throw new Error("MONGO_URI is not set");
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb connected")
    }
    catch(error){
        console.log("Error connecting to mongodb", error)
        process.exit(1)  //1 is for erro and 0 is for success
    }
}

module.exports = connectDB