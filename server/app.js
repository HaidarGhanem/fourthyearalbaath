const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongo = require('mongoose');
const mongodb = require('mongodb');
const session =require('express-session');
const passport = require('passport');
//const authRoutes = require("./routes/auth.js");
require('dotenv').config();
//-----------connection to mongodb----------
mongo
  .connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connected!');
  })
  .catch(err => {
    console.error(err);
  });
//------------------------------------------
app.use(express.static('client'));
app.use(session({
                  secret:'secret',
                  resave:false,
                  saveUninitialized:false})
);
app.use(passport.initialize());
app.use(passport.session());
//passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure',}));
//}));
//----------------------------------------
//app.use('/auth', authRoutes);
//----------------------------------------
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//basic server and socket are ready
