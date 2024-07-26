import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// function to initialize passport with email authentication
export function initPassportEmail(passport, getUserByEmail, getUserById) {
    // helper function to authenticate a username
    const _authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        
        if(user == null){
            console.log('email not found')
            return done(null, false, { message: 'email not found' })
        }
       
        try{
            if(await bcrypt.compare(password, user.hashed_password)){
                console.log('i was here2')
                return done(null, user)
            }
            else{
                console.log('password incorrect')
                return done(null, false, { message: 'password incorrect' })
            }

        }catch(e){
            return e
        }
    }

    // use local strategy for email authentication
    passport.use('local-email', new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' }, _authenticateUser
    ))
   
    // serialize user to store user_id in session
    passport.serializeUser((user, done) => done(null, user.user_id));
    // deserialize user to retrieve user from session
    passport.deserializeUser((user_id, done) => {
        return done(null, getUserById(user_id))
    });
}