import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import { initPassport } from "./initPassport.js";
import { User } from "./user.js"
import methodOverride from "method-override";
const app = express();

initPassport(passport, async username => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    const usernameQuery = 'SELECT * FROM users WHERE username = ?';
    
    const usernameField = [username];
    const [results] = await connection.execute(usernameQuery, usernameField);
    console.log('results.length is : '+ results.length)
    if (results.length === 0){
        return null;
    }
    const ret = results.map(result => new User(result.user_id, result.username, result.email, result.firstname, result.lastname, result.hashed_password, result.profile_description));
    return ret[0];

},  async email => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    const emailQuery = 'SELECT * FROM users WHERE email = ?';
    
    const emailField = [email];
    const [results] = await connection.execute(emailQuery, emailField);
    if (results.length === 0){
        return null;
    }
    const ret = results.map(result => new User(result.user_id, result.username, result.email, result.firstname, result.lastname, result.hashed_password, result.profile_description));
    
    return ret[0];
}, async id => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    const idQuery = 'SELECT * FROM users WHERE user_id = ?';
    
    const idField = [id];
    const [results] = await connection.execute(idQuery, idField);
    console.log('results.length is : '+ results.length)
    if (results.length === 0){
        return null;
    }
    const ret = results.map(result => new User(result.user_id, result.username, result.email, result.firstname, result.lastname, result.hashed_password, result.profile_description));
    return ret[0];
});
console.log('first');

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



app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", {name: req.user.firstname});
});


app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
});


app.get("/signup", checkNotAuthenticated, (req, res) => {
    res.render("signup.ejs");
});


app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));


app.post("/signup", checkNotAuthenticated, async (req, res) => {
    try{
        const hash_password = await bcrypt.hash(req.body.password, 10);
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
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
        res.redirect("/login")
    });
    
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000); 

