import { Strategy as LocalStrategy } from 'passport-local';
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { User } from './user.js'
import dotenv from "dotenv";
dotenv.config();

export function initPassport(passport, getUserByUsername, getUserByEmail, getUserById) {
    // helper function to authenticate a username
    const _authenticateUser = async (username, password, done) => {
        console.log('authen')
        const user = await getUserByUsername(username);
        console.log('user is : ' + user)
        if(user == null){
            console.log('username not found')
            return done(null, false, { message: 'username not found' })
        }
        // console.log('password is : ' + results[0].hashed_password)
        // console.log('user.hashed_password is : ' + user.hashed_password)
        try{
            console.log('i was here1')
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

// import { Strategy as LocalStrategy } from 'passport-local'
// import { compare } from 'bcrypt'

// function initialize(passport, getUserByUsername, getUserById) {
//   const authenticateUser = async (username, password, done) => {
//     const user = getUserByUsername(username)
//     if (user == null) {
//       return done(null, false, { message: 'No user with that email' })
//     }

//     try {
//       if (await compare(password, user.password)) {
//         return done(null, user)
//       } else {
//         return done(null, false, { message: 'Password incorrect' })
//       }
//     } catch (e) {
//       return done(e)
//     }
//   }

//   passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
//   passport.serializeUser((user, done) => done(null, user.id))
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//   })
// }

// export default initialize