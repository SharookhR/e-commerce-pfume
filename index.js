const express = require('express');
const connectDb = require('./config/db');
const auth_route = require('./Routes/authRoute');
require("dotenv").config();
const app=express()


const authRoute =require('./Routes/authRoute')


app.use('/auth',authRoute)

async function server() {
    const DB = process.env.DATABASE_URL
    
    const PORT = process.env.PORT || 3300
    try {
        await connectDb(DB) //Database connection
        app.listen(PORT, ()=>{
            console.log(`Listening to the http://localhost:${PORT}`);
            
        })
    } catch (error) {
        console.log(error);
        
    }
}
server()

