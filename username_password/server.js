import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import { initPassportUsername } from "./initPassportUsername.js";
import { initPassportEmail } from "./initPassportEmail.js";
import { User } from "./user.js"
import methodOverride from "method-override";
const app = express();

// Initialize passport with email authentication
initPassportEmail(passport, async email => {
    // Create a connection to the database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    // Check if the email is not null
    if(email != null){

        // Query the database for the email
        const emailQuery = 'SELECT * FROM users WHERE email = ?';
        const emailField = [email];
        var [emailResults] = await connection.execute(emailQuery, emailField);
        console.log('emailresults.length is : '+ emailResults.length)
    }

    // If the email is found, create a new User object
    if(emailResults.length != 0){
        var ret = emailResults.map(result => new User(result.user_id, result.username, result.email, result.firstname, result.lastname, result.hashed_password, result.profile_description));
    }
    // If the email is not found, return null
    else{
        return null;
    }
    console.log('im here email')
    return ret[0];

}, async id => {
    // Create a connection to the database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    // Query the database for the user_id
    const idQuery = 'SELECT * FROM users WHERE user_id = ?';
    
    const idField = [id];
    const [results] = await connection.execute(idQuery, idField);
    // If the user_id is not found, return null
    if (results.length === 0){
        return null;
    }

    // Create a new User object
    const ret = results.map(result => new User(result.user_id, result.username, result.email, result.firstname, result.lastname, result.hashed_password, result.profile_description));

    return ret[0];
});

// Initialize passport with username authentication
initPassportUsername(passport, async username => {
    // Create a connection to the database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    
    // Check if the username is not null
    if(username != null){
        // Query the database for the username
        const usernameQuery = 'SELECT * FROM users WHERE username = ?';
        const usernameField = [username];
        var [userResults] = await connection.execute(usernameQuery, usernameField);

    }

    // If the username is found, create a new User object
    if (userResults.length != 0){
        var ret = userResults.map(result => new User(result.user_id, result.username, result.email, result.firstname, result.lastname, result.hashed_password, result.profile_description));
    }
   
    // If the username is not found, return null
    else{
        return null;
    }
    console.log('im here username')
    return ret[0];

}, async id => {
    // Create a connection to the database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    // Query the database for the user_id
    const idQuery = 'SELECT * FROM users WHERE user_id = ?';
    
    const idField = [id];
    const [results] = await connection.execute(idQuery, idField);
    // If the user_id is not found, return null
    if (results.length === 0){
        return null;
    }
    // Create a new User object
    const ret = results.map(result => new User(result.user_id, result.username, result.email, result.firstname, result.lastname, result.hashed_password, result.profile_description));
    return ret[0];
});

// Set up middleware
app.use(express.urlencoded({ extended: false }))

app.use(flash())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())

app.use(passport.session())

app.use(methodOverride("_method"));

// Set up routes
app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", {name: req.user.firstname});
});

app.get("/loginUsername", checkNotAuthenticated, (req, res) => {
    res.render("loginUsername.ejs");
});

app.get("/loginEmail", checkNotAuthenticated, (req, res) => {
    res.render("loginEmail.ejs");
});

app.get("/signup", checkNotAuthenticated, (req, res) => {
    res.render("signup.ejs");
});

app.post("/loginUsername", checkNotAuthenticated, passport.authenticate("local-username", {
    successRedirect: "/",
    failureRedirect: "/loginUsername"
}));

app.post("/loginEmail", checkNotAuthenticated, passport.authenticate("local-email", {
    successRedirect: "/",
    failureRedirect: "/loginEmail"
}));

app.post("/signup", checkNotAuthenticated, async (req, res) => {
    try{
        // Hash the password
        const hash_password = await bcrypt.hash(req.body.password, 10);
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        // Insert the new user into the database
        const userQuery = 'INSERT INTO users (username, email, firstname, lastname, hashed_password, profile_description) VALUES (?, ?, ?, ?, ?, ?)';
        const userValues = [req.body.username, req.body.email, req.body.firstname, req.body.lastname, hash_password, req.body.profileDescription];
        const result = await connection.execute(userQuery, userValues);
        res.redirect("/login");
    } catch {
        res.redirect("/signup");
    }
});

app.delete("/logout", (req, res) => {
    req.logOut(function(error){
        if (error) {
            return next(error);
        }
        res.redirect("/loginUsername")
    });
    
})

// Check if the user is authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

// Check if the user is not authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

// Start the server
app.listen(3000); 