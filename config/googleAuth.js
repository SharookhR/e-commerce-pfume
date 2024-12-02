const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require("../Model/UserModel");
require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_URL
},
    
    
    async (accessToken, refreshToken, profile, done) => {
        let user = await UserModel.findOne({ email:profile.emails[0].value })
        console.log(profile.emails);
        
        
        
        try {
            
            
            if (!user) {
                user = new UserModel({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    number: null
                })
                await user.save();
                return done(null, user)
            }
            return done(null, user)
        } catch (error) {
            console.log(error, false);

        }
    }

))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
        done(null, user);
});
