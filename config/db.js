const mongoose = require('mongoose')

const connectDb = async(URL)=>{
    mongoose.connection.on('connected', ()=>{
        console.log('Connected to Database');
        
    })
    mongoose.connection.on('disconnected', ()=>{
        console.log('Disconnected from Database');
        
    })

    try {
        await mongoose.connect(URL)
    } catch (error) {
        console.log(error);
        
    }
}

module.exports=connectDb;