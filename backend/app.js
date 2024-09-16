const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const passport = require('passport');

const SQLiteStore = require('connect-sqlite3')(session);
const userAPI = require('./api/usersAPI');

const authRouter = require('./routes/auth');
const expenseRateRouter = require('./routes/expense_rate');
const friendRouter = require('./routes/friend');
const groupRouter = require('./routes/group');
const itemRouter = require('./routes/item');
const paymentRequestRouter = require('./routes/payment_request');
const receiptRouter = require('./routes/receipt');
const taxRouter = require('./routes/tax');
const tipRouter = require('./routes/tip');
const userRouter = require('./routes/user');

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, (error) =>{
    if(!error) console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else console.log("Error occurred, server can't start", error);
});


console.log('Session Secret:', process.env.SESSION_SECRET);

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './db' })
}));

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser(async (id, done) => {
  const user = await userAPI.getUserByID(id);
  done(null, user);
});

function checkUser(req, res, next) {
  if(!req.isAuthenticated()) res.status(401).json({msg: 'Must be logged in to access this resource'});
  next();
}

app.use('/auth', authRouter);
app.use('/expenserates', checkUser, expenseRateRouter);
app.use('/friends', checkUser, friendRouter);
app.use('/groups', checkUser, groupRouter);
app.use('/items', checkUser, itemRouter);
app.use('/paymentrequests', checkUser, paymentRequestRouter);
app.use('/receipts', checkUser, receiptRouter);
app.use('/taxes', checkUser, taxRouter);
app.use('/tips', checkUser, tipRouter);
app.use('/users', checkUser, userRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send(err.stack);
})
app.use(cors({
  origin: 'http://10.0.0.8:8081', // Allow requests from your frontend origin
  methods: ['GET', 'POST'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));


module.exports = app;