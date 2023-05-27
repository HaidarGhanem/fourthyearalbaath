const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongo = require('mongoose');
const mongodb = require('mongodb');
require('dotenv').config();
//-----------connection to mongodb----------
mongo
.connect(process.env.Mongo_URI,{
  useNewUrlParser:true
})
//in connect we set the string connection
//in then when its done and catch when not
.then(()=>{console.log('DB connected!')})
.catch(err=>{console.error(err)})
//------------------------------------------
//using public folder as a static directory
app.use(express.static('public'));
//connection emit when user join server
io.on('connection', (socket) => {
  console.log('User connected');
//the emit for messaging
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
//disconnect emit when user leave server
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
//port listening
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//basic server and socket are ready
