const express = require('express');
const path = require('path');

const session = require('express-session');
const passport = require('passport');

const SQLiteStore = require('connect-sqlite3')(session);

const userRouter = require('./routes/auth');

const app = express();
const PORT = 3000;

app.listen(PORT, (error) =>{
    if(!error) console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else console.log("Error occurred, server can't start", error);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'password',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore
}));
app.use(passport.authenticate('session'));

app.use('/auth', userRouter);