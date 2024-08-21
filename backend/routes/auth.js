const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const dotenv = require('dotenv');

const bcrypt = require('bcrypt');
const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');

const userAPI = require('../api/usersAPI');
const User = require('../class/userClass');

dotenv.config();

/* passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile' ]
  }, function verify(issuer, profile, cb) {
        //db logic
        return [issuer, profile, cb]
      }
));  

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

//initiate google authentication
router.get('/google',
    passport.authenticate('google', { scope:[ 'email', 'profile' ] }
));

//response after (attempting to) login
router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/google/success',
        failureRedirect: '/google/failure'
}));

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
})); */

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const users = await userAPI.getUsers("WHERE username='" + username +"'");
            if (users.length == 0) return done(null, false, { error: "Incorrect username" });

            const passwordsMatch = await bcrypt.compare(password, users[0].password);
            if (passwordsMatch) return done(null, users[0]);
            else return done(null, false, { error: "Incorrect password" });
        } catch (err) {
            return done(err);
        }
    })
);

//create a new user
//Authorization: TODO: Must verify email to successfully create account
router.post('/signup', [
    body("username", "username must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("first_name", "first_name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("last_name", "last_name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("email", "email must be a valid email")
        .trim()
        .isEmail()
        .escape(),
    body("password", "password must be at least 8 characters")
        .trim()
        .isLength({min: 8})
        .escape(),
    body("profile_description", "profile_description must be 250 characters or less")
        .trim()
        .isLength({max: 250})
        .escape(),
    async (req, res, next) => {
      const errors = validationResult(req);

      const salt = await bcrypt.genSalt(15);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = new User(
        req.body.username,
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        hashedPassword,
        req.body.profile_description,
      );
  
      if (errors.isEmpty()) {
        try {
            await userAPI.addUser(user);
            if(!res.headersSent) res.status(200).json(JSON.stringify(user));
        }
        catch (err){
            res.status(err.code).send(err);
        }
      }
      else res.status(400).send(errors);
    }
]);

router.post("/login", passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.status(200).send(req.user);
    }
);

//Log out of account
router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.sendStatus(200);
    });
});

module.exports = router;