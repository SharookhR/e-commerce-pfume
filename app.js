require("dotenv").config();
const express = require('express');
const path = require('path')
const connectDb = require('./config/db');
const cookieParser = require('cookie-parser')
const nocache = require('nocache')
const routes = require('./Routes/index')
const app=express()


app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use('/assets',express.static(path.join(__dirname, 'public/user/')));
app.use(express.static('public'))
app.set("view engine",'ejs')
app.set("views", ["./Views/user", "./Views/admin"])
app.use(nocache())

const authRoute =require('./Routes/authRoute')


app.use('/',routes)

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

