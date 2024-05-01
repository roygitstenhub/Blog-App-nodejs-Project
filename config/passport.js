import GoogleStrategy from "passport-google-oauth20"
import mongoose from "mongoose"
import User from "../models/model.user.js"


export const initilizingPassport = (passport) => {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },

        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }

            try {
                let user = await User.findOne({ googleId: profile.id })
                if (user) {
                    done(null, user)
                }
                else {
                    user = await User.create(newUser)
                }
            } catch (err) {
                console.log(err)
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {

           const user = await User.findById(id)
            done(null, user)

        } catch (error) {
            done(error, false)
        }
    })

}
