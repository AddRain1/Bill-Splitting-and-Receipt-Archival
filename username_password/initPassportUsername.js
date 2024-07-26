// Import the LocalStrategy from passport-local
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// Export a function to initialize the passport with username authentication
export function initPassportUsername(passport, getUserByUsername, getUserById) {
    // Define an asynchronous function to authenticate the user
    const _authenticateUser = async (username, password, done) => {
        // Get the user from the database using the username
        const user = await getUserByUsername(username);
        
        // If the user is not found, return an error message
        if(user == null){
            console.log('username not found')
            return done(null, false, { message: 'username not found' })
        }
       
        try{
            // Compare the password with the hashed password in the database
            if(await bcrypt.compare(password, user.hashed_password)){
                console.log('i was here2')
                // If the password is correct, return the user
                return done(null, user)
            }
            else{
                console.log('password incorrect')
                // If the password is incorrect, return an error message
                return done(null, false, { message: 'password incorrect' })
            }

        }catch(e){
            // If there is an error, return the error
            return e
        }
    }

    // Use the LocalStrategy to authenticate the user
    passport.use('local-username', new LocalStrategy(
        { usernameField: 'username', passwordField: 'password' }, _authenticateUser
    ))
   
    // Serialize the user by storing the user_id in the session
    passport.serializeUser((user, done) => done(null, user.user_id));
    // Deserialize the user by retrieving the user from the database using the user_id
    passport.deserializeUser((user_id, done) => {
        return done(null, getUserById(user_id))
    });
}