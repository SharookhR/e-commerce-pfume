require("dotenv").config();
const express = require('express');
const path = require('path')
const connectDb = require('./config/db');
const cookieParser = require('cookie-parser')
const nocache = require('nocache')
const routes = require('./Routes/index')
const app=express()
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
require('./config/googleAuth')


app.set("view engine",'ejs')
app.set("views", ["./Views/user", "./Views/admin"])
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))

app.use(passport.initialize())
app.use(passport.session());
app.use(nocache())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(flash())





app.use('/',routes)

async function server() {
    const DB = process.env.DATABASE_URL
    
    const PORT = process.env.PORT || 3300
    try {
        await connectDb(DB) 
        app.listen(PORT, ()=>{
            console.log(`Listening to the http://localhost:${PORT}`);
            
        })
        
    } catch (error) {
        console.log(error);
        
    }
}
server()

