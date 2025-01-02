const express = require('express');
const path = require('path');

const session = require('express-session');
const passport = require('passport');

const SQLiteStore = require('connect-sqlite3')(session);

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

const app = express();
const PORT = 3000;

app.listen(PORT, (error) =>{
    if(!error) console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else console.log("Error occurred, server can't start", error);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './db' })
}));
app.use(passport.authenticate('session'));

app.use('/auth', authRouter);
app.use('/expenserates', expenseRateRouter);
app.use('/friends', friendRouter);
app.use('/groups', groupRouter);
app.use('/items', itemRouter);
app.use('/paymentrequests', paymentRequestRouter);
app.use('/receipts', receiptRouter);
app.use('/taxes', taxRouter);
app.use('/tips', tipRouter);
app.use('/users', userRouter);