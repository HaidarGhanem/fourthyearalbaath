const crypto = require('crypto');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = require('../routes/auth.js');
const io = require('socket.io');
require('dotenv').config();


 //here we gonna upload infos for new ueser in db
 const mongoURI = Mongo_URI;
 //just checking for db connection is good with userdb
 mongoose
 .connect(mongoURI+'/userdb')
 .then(()=>{console.log('connected to userdb');})
 .catch((err)=>console.error('error connecting userdb'));
 //done checking
 //just checking for db connection is good with chatdb
 mongoose
 .connect(mongoURI+'/chatdb')
 .then(()=>{console.log('connected to chatdb');})
 .catch((err)=>console.error('error connecting chatdb'));
 //done checking
 //creating model (models are always capital letter)
 const UserModel = mongoose.model('userdb',collection);
 const ChatModel = mongoose.model('chatdb',collection);

 //===========================================================================================
 // OLD SIGNUP AND LOGIN WITHOUT SESSION THING IN COMMENT :
                                    /** 
                                        //----creating controller for signup-------
                                        const signup = (req,res) => {
                                            try{
                                                //get informations from the body as JSON
                                                const { firstname, lastname, email, password, phonenumber } = req.body;
                                                //storing values in array of objects to share it with db
                                                const userdata = { firstname, lastname, email, password, phonenumber };
                                                //creating hashed random userid for security
                                                const userid = crypto.randomBytes(8).toString('hex');
                                                             //creating new user doc to save his infos in
                                                             const newUser = new UserModel(userdata);
                                                             newUser.save((err)=>{
                                                                if(err){
                                                                    console.error(err);
                                                                    res.status(500).json({message: error});
                                                                }
                                                                else {
                                                                    res.status(200).send('user saved in db');
                                                                }});
                                            }
                                            catch (error) {
                                                console.log(error);
                                                res.status(500).json({message: error});
                                            }
                                        }
                                     
                                          //----creating controller for login-------
                                          const login = (req,res) => {
                                              try{
                                                  //getting the input of email and password from body
                                                  const {emaillogin , passwordlogin} = req.body;
                                                  //storing what client wrote in body
                                                  const userdata = {emaillogin , passwordlogin};
                                                  //getting data from the model to compare with
                                                  array.forEach(UserModel => { 
                                                      const data = UserModel.find({email,password}, (err,doc)=>{
                                          
                                                      
                                                      if (userdata.emaillogin === data.email && userdata.passwordlogin === data.password)
                                                      {
                                                          console.log('login done seccussfully');
                                                          router.get('/main',main);
                                                      }
                                                      else if(err)
                                                      {
                                                          console.error('Error fetching data from MongoDB:', err);
                                                          return;
                                                      }
                                                  });
                                                  });
                                                  
                                          
                                              }
                                              catch{
                                                  console.log(error);
                                                  res.status(500).json({message: error});
                                              }
                                          }*/
//===========================================================================================
const signup = async (req, res, next) => {
    const { email, password , firstname , lastname , phonenumber } = req.body;
    try {
        const userid = crypto.randomBytes(8).toString('hex');
        const user = await UserModel.create({ email, password , firstname , lastname , userid , phonenumber});
        req.save(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    } catch (err) {
        return next(err);
    }
};
const login =  async (req, res, done) => {
    const { email , password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        const match = await compare(password, user.password);
        if (!match) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
};

passport.serializeUser((user, done) => {
    done(null, user.userid);
});

passport.deserializeUser(async (userid, done) => {
    try {
        const user = await UserModel.findById(userid);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

//----creating controller for searching-------
const searching = async (req,res) =>{
    try{
        //if user wrote one of those for searching
        const {userid , phonenumber , firstname } = await req.body;
        //store those to search in them in db
        const userdata = {userid , phonenumber , firstname};
        //getting data from the model to compare with
        array.forEach(UserModel => { 
            const data = UserModel.find({userid , phonenumber , firstname},(err,doc)=>{
            if (userdata.userid === data.userid || userdata.phonenumber === data.phonenumber || userdata.firstname === data.firstname)
            {
                return (data);
            }
            else if(userdata.userid != data.userid || userdata.phonenumber != data.phonenumber || userdata.firstname != data.firstname )
            {
                res.status(500).console.log('couldnt find user');
            }});
        });
    }
    catch{
        console.log(error);
        res.status(500).json({message: error}); 
    }
}
//----creating controller for chat with the user-------
const signalchat = (req,res)=>{
    //after front form for signal chat
    try{
        //getting the login userid and compare with the user2id if there is any chat
        const {userid1 , userid2 , firstname} = req.body;
        const chatdata = {userid1 , userid2 , firstname};
        //see if there any chatmodel contains in its collection both of ids
        array.forEach(ChatModel => { 
            const data = ChatModel.find({userid1 , userid2},(err,doc)=>{
            if (chatdata.userid1 === data.userid1 && chatdata.userid2 === data.userid2)
            {   //if there was a model with both id give us data
                const thischat = ChatModel.find({chatid,userid1,userid2,message,time});
                return (thischat);
            }
            //if there isnt a model between main user and other user create new model for it
            else if(chatdata.userid1 === data.userid1 && chatdata.userid2 != data.userid2)
            { 
            //and save the data of the chat for both users in chatdb
            const newChat = new ChatModel({userid1,userid2,message,time});
            newChat.save((err)=>{
                if(err){
                    console.error(err);
                    res.status(500).json({message: error});
                }
                else {
                    res.status(200).send('user saved in db');
                }})
            }});
        });
    }
    catch{

    }
}
const chattingSingal = (req,res)=>{
    io.on('connection', (socket) => {
        console.log('User connected');
      
        // Handle chat messages
        socket.on('chat message', async (data) => {
          // Save the message to the database
          const chat = await ChatModel.findOneAndUpdate(
            { chatid , userid1: data.sender, userid2: data.receiver },
            { $push: { messages: { message: data.message, time: Date.now() } } },
            { upsert: true, new: true }
          );
      
          // Emit the message to the receiver
          socket.to(data.receiver).emit('chat message', data);
        });
      
        // Handle disconnections
        socket.on('disconnect', () => {
          console.log('User disconnected');
        });
      });
}
const groupchat = async (req, res) => {
    try {
      //getting groupid from the body
      const { groupid } = req.body;
  
      // Find the group chat
      const chat = await ChatModel.findById(groupid);
  
      return res.status(200).json(chat);
    } 
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
const chattingGroup = (req,res) =>{

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('User connected');
  
    // Handle joining a group chat
    socket.on('join group', async (data) => {
      // Join the room
      socket.join(data.groupid);
  
      // Emit a message to the group that a user has joined
      socket.to(data.groupid).emit('user joined', data.userid);
    });
  
    // Handle leaving a group chat
    socket.on('leave group', async (data) => {
      // Leave the room
      socket.leave(data.groupid);
  
      // Emit a message to the group that a user has left
      socket.to(data.groupid).emit('user left', data.userid);
    });
  
    // Handle group chat messages
    socket.on('group message', async (data) => {
      // Save the message to the database
      const chat = await ChatModel.findOneAndUpdate(
        { groupid: data.groupid },
        { $push: { messages: { sender: data.sender, message: data.message, time: Date.now() } } },
        { new: true }
      );
  
      // Emit the message to the group
      socket.to(data.groupid).emit('group message', data);
    });
  
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}
const videocall = (io) =>{
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
      
        socket.on('join-room', (roomid) => {
          const roomClients = io.sockets.adapter.rooms.get(roomid);
      
          if (roomClients && roomClients.size > 1) {
            socket.emit('error', 'Room is full');
            return;
          }
      
          socket.join(roomid);
          socket.emit('joined-room', roomid);
      
          socket.on('disconnect', () => {
            socket.broadcast.to(roomid).emit('user-disconnected', socket.id);
          });
      
          socket.on('offer', (offer) => {
            socket.broadcast.to(roomid).emit('offer', offer);
          });
      
          socket.on('answer', (answer) => {
            socket.broadcast.to(roomid).emit('answer', answer);
          });
      
          socket.on('ice-candidate', (candidate) => {
            socket.broadcast.to(roomid).emit('ice-candidate', candidate);

                                /**
                                 *  ----------------WebRTC logic for client side-----------
                                 * <script>
                                  const socket = io();
                                  const localVideo = document.getElementById('localVideo');
                                  const remoteVideo = document.getElementById('remoteVideo');
                                  const roomId = 'test-room'; // Replace this with a unique room ID

                                  // WebRTC setup
                                  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
                                  const pc = new RTCPeerConnection(configuration);

                                  pc.onicecandidate = (event) => {
                                    if (event.candidate) {
                                      socket.emit('ice-candidate', event.candidate);
                                    }
                                  };

                                  pc.ontrack = (event) => {
                                    remoteVideo.srcObject = event.streams[0];
                                  };

                                  // Get local media stream
                                  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                                    .then((stream) => {
                                      localVideo.srcObject = stream;
                                      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
                                      socket.emit('join-room', roomId);
                                    })
                                    .catch((error) => console.error('Error accessing media devices.', error));

                                  // Socket.IO event handlers
                                  socket.on('joined-room', () => {
                                    pc.createOffer()
                                      .then((offer) => pc.setLocalDescription(offer))
                                      .then(() => socket.emit('offer', pc.localDescription));
                                  });

                                  socket.on('offer', (offer) => {
                                    pc.setRemoteDescription(offer)
                                      .then(() => pc.createAnswer())
                                      .then((answer) => pc.setLocalDescription(answer))
                                      .then(() => socket.emit('answer', pc.localDescription));
                                  });

                                  socket.on('answer', (answer) => {
                                    pc.setRemoteDescription(answer);
                                  });

                                  socket.on('ice-candidate', (candidate) => {
                                    pc.addIceCandidate(candidate);
                                  });

                                  socket.on('user-disconnected', () => {
                                    remoteVideo.srcObject = null;
                                  });
                                 /script>
                                 * 
                                 */
})})})}
const call = (req,res) =>{
    
    io.on('connection', (socket) => {
    console.log('a user connected');
  
    // Join a room
    socket.on('join', (roomid) => {
      socket.join(roomid);
      console.log(`User joined room ${roomid}`);
    });
  
    // Leave a room
    socket.on('leave', (roomid) => {
      socket.leave(roomid);
      console.log(`User left room ${roomid}`);
    });
  
    // Send a call
    socket.on('call', (roomid) => {
      socket.to(roomid).emit('call', socket.id);
      console.log(`User ${socket.id} sent a call request to room ${roomid}`);
    });
  
    // Answer a call request
    socket.on('answer', (roomid, userid2) => {
      socket.to(roomid).emit('answer', userid2);
      console.log(`User ${socket.id} answered a call request from user ${userid2} in room ${roomid}`);
    });
  
    // End a call
    socket.on('end', (roomid) => {
      socket.to(roomid).emit('end');
      console.log(`User ${socket.id} ended the call in room ${roomid}`);
    });
  
    // Disconnect
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });}
  const gettingUserInfo = (req,res)=>{
    const data = UserModel.find({userid , firstname , lastname , email , phonenumber});
    return (data);
  }
  const delChat = (req,res)=>{
    const {chatid} = req.body;
    const del = ChatModel.findById(chatid);
    del.deleteOne();
  }
  const delAccount = (req,res)=>{
    const {userid} = req.body;
    const del = UserModel.findById(userid);
    del.deleteOne();
  }
const UpdateUserInfo = (req,res) =>{
   const {firstname , lastname , email , password , userid} = req.body;
   const newData = {firstname , lastname , email , password , userid};
   const user = UserModel.findById(newData.userid);
   user.updateOne(newData).save();
}
const logout = (req,res) =>{
  //still alot to do with session as an update
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send('Error logging out');
      } else {
        res.send('Logged out successfully');
      }
    });
  } else {
    res.status(400).send('Not logged in');
}}
const ForgetPassword = async (req, res) => {
  try {
    // Get user by email
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('No user found with that email.');
    }
    // Generate random 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000);
    // Send verification code via SMS to user's phone number
    client.messages.create({
      body: `Your verification code is ${code}`, 
      from: '',  
      to: user.phonenumber
    });
    // Save code and generate reset token 
    user.updateOne({password : crypto.randomBytes(20).toString('hex')});
    user.verificationCode = code;
    await user.save();
    // Send reset password email
    res.status(200).send('Verification code sent!');
  } catch (err) {
    res.status(500).send(err);  
  }
}
module.exports = {login , signup , searching , signalchat , chattingSingal
   , groupchat , chattingGroup , call , videocall , logout , delChat , gettingUserInfo , UpdateUserInfo , 
  delAccount , ForgetPassword ,  };