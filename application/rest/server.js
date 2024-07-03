const express = require('express');
const session = require('express-session');
const path = require('path');
const sdk = require('./sdk');
const checkSession = require('./middleware');

const app = express();

const PORT = 8001;
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(session({
   secret: 'hyperledgerfabric',
   resave: false,
   saveUninitialized: true,
   cookie: { secure: false }
}));

app.get('/init', function (req, res) {
   let user = req.query.user;
   let userval = req.query.userval;
   
   let args = [user, userval];
   sdk.send(false, 'init', args, res);
});

app.get('/charge', function (req, res) {
   let user = req.query.user;
   let userval = req.query.userval;
   
   let args = [user, userval];
   sdk.send(false, 'charge', args, res);
});

app.get('/initItem', function (req, res) {
   let itemName = req.query.itemName;
   let styleNum = req.query.styleNum;
   let brand = req.query.brand;
   let inventory = req.query.inventory;
   
   let args = [itemName, styleNum, brand, inventory];
   sdk.send(false, 'initItem', args, res);
});

app.get('/purchaseItem', function (req, res) {
   let user = req.query.user;
   let itemId = req.query.itemId;
   
   let args = [user, itemId];
   sdk.send(false, 'purchaseItem', args, res);
});

app.get('/invoke', function (req, res) {
   let sender = req.query.sender;
   let reciever = req.query.reciever;
   let value = req.query.value;
   
   let args = [sender, reciever, value];
   sdk.send(false, 'invoke', args, res);
});

app.get('/queryitem', function (req, res) {
   let itemId = req.query.itemId;
   let args = [itemId];
   sdk.send(true, 'queryitem', args, res, (result) => {
      res.json({ status: 'success', data: JSON.parse(result) });
  });
});

app.get('/querypurchase', function (req, res) {
   let user = req.query.user;
   let args = [user];
   sdk.send(true, 'queryPurchase', args, res);
});

app.get('/query', function (req, res) {
   let name = req.query.name;
   let args = [name];
   sdk.send(true, 'query', args, res);
});

app.get('/delete', (req, res) => {
   let name = req.query.name;
   let args = [name];
   sdk.send(false, 'delete', args, res)
});

//game

function checkAdmin(req, res, next) {
   if (req.session && req.session.user === 'admin') {
       next();
   } else {
       res.status(403).json({ status: 'error', message: 'Forbidden: Admins only' });
   }
}

app.post('/register', async function(req, res) {
   let { username, userId, password, confirmPassword } = req.body;
   if (password !== confirmPassword) {
       return res.json({ status: 'error', message: 'Passwords do not match' });
   }
   let args = [username, userId, password, confirmPassword];
   sdk.send(false, 'registerUser', args, res, (result) => {
       res.json({ status: 'success', message: result });
   });
});

app.post('/login', async function(req, res) {
   let { userId, password } = req.body;
   let args = [userId, password];
   sdk.send(true, 'loginUser', args, res, (result) => {
       if (result === 'Login successful') {
           req.session.user = userId;
           res.json({ status: 'success', isAdmin: userId === 'admin' });
       } else {
           res.json({ status: 'error', message: result });
       }
   });
});

app.get('/login', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/login.html'));
});

app.get('/mainpage.html', checkSession, (req, res) => {
   res.sendFile(path.join(__dirname, '../client/mainpage.html'));
});
app.get('/mainpage', checkSession, (req, res) => {
   res.sendFile(path.join(__dirname, '../client/mainpage.html'));
});


app.get('/recharge', checkSession, (req, res) => {
   res.sendFile(path.join(__dirname, '../client/recharge.html'));
});
app.get('/recharge.html', checkSession, (req, res) => {
   res.sendFile(path.join(__dirname, '../client/recharge.html'));
});

app.post('/recharge', checkSession, async function(req, res) {
   let { amount } = req.body;
   let userId = req.session.user;
   let args = [userId, amount];
   sdk.send(false, 'userRechargePoints', args, res, (result) => {
       res.json({ status: 'success', message: result });
   });
});

app.post('/send', checkSession, async function(req, res) {
   let { receiverId, amount } = req.body;
   let senderId = req.session.user;
   let args = [senderId, receiverId, amount];
   sdk.send(false, 'sendPoints', args, res, (result) => {
       res.json({ status: 'success', message: result });
   });
});

app.post('/playGame', checkSession, async function(req, res) {
   let { betAmount, choice } = req.body;
   let userId = req.session.user;
   let args = [userId, betAmount, choice];
   sdk.send(false, 'playGame', args, res, (result) => {
       res.json({ status: 'success', message: result });
   });
});

app.get('/querygame', checkSession, function(req, res) {
   let userId = req.session.user;
   let args = [userId];
   sdk.send(true, 'querygame', args, res, (result) => {
       res.json({ status: 'success', data: JSON.parse(result) });
   });
});

app.get('/logout', function(req, res) {
   req.session.destroy((err) => {
       if (err) {
           return res.status(500).json({ status: 'error', message: 'Failed to logout' });
       }
       res.json({ status: 'success', message: 'Logged out successfully' });
   });
});

app.get('/admin', checkSession, checkAdmin, (req, res) => {
   res.sendFile(path.join(__dirname, '../client/admin.html'));
});
app.get('/admin.html', checkSession, checkAdmin, (req, res) => {
   res.sendFile(path.join(__dirname, '../client/admin.html'));
});

app.post('/admin/recharge', checkSession, checkAdmin, async function(req, res) {
   let { userId, amount } = req.body;
   let args = [userId, amount];
   sdk.send(false, 'rechargePoints', args, res, (result) => {
       res.json({ status: 'success', message: result });
   });
});

app.use(express.static(path.join(__dirname, '../client')));
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);