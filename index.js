require("dotenv").config();
const express = require('express');
const connectDb = require('./config/db');
const cookieParser = require('cookie-parser')
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.set("view engine",'ejs')
app.set("views", "./Views/auth")
app.use(express.static('public'))

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

