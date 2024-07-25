import { Strategy as LocalStrategy } from 'passport-local';
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { User } from './user.js'
import dotenv from "dotenv";
dotenv.config();

export function initPassport(passport, getUserByUsername, getUserById) {
    // helper function to authenticate a username
    const _authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        
        if(user == null){
            console.log('username not found')
            return done(null, false, { message: 'username not found' })
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

    passport.use(new LocalStrategy(
        { usernameField: 'username', passwordField: 'password' }, _authenticateUser
    ))
   
    passport.serializeUser((user, done) => done(null, user.user_id));
    passport.deserializeUser((user_id, done) => {
        return done(null, getUserById(user_id))
    });
}