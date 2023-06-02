const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = require('../routes/auth.js');
const io = require('socket.io');
require('dotenv').config();

//MongoDB connection : cheked [true]
const userdbConnection = mongoose.createConnection(mongoURI + '/userdb', { useNewUrlParser: true, useUnifiedTopology: true });
const chatdbConnection = mongoose.createConnection(mongoURI + '/chatdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Check connection for userdb
userdbConnection
  .then(() => {
    console.log('connected to userdb');
  })
  .catch((err) => console.error('error connecting userdb'));

// Check connection for chatdb
chatdbConnection
  .then(() => {
    console.log('connected to chatdb');
  })
  .catch((err) => console.error('error connecting chatdb'));

// Create models for userdb and chatdb
const UserModel = userdbConnection.model('User', collection);
const ChatModel = chatdbConnection.model('Chat', collection);
//-------------------------------------------------------------------------------------------------

//Sign Up : checked [true]
const signup = async (req, res, next) => {
    const { email, password , firstname , lastname , phonenumber } = req.body;
    try {
        const userid = crypto.randomBytes(8).toString('hex');
        const user = await UserModel.create({ email, password , firstname , lastname , userid , phonenumber});
        user.save(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    } catch (err) {
        return next(err);
    }
};
//---------------------------------------------------------------------------------------------------

//Log In : checked [true]
const login =  async (req, res, done) => {
    const { email , password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
};
//---------------------------------------------------------------------------------------------------

//Passport thing : checked [true]
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
      return done(null, false, { message: 'Incorrect email or password.' });
  }
  return done(null, user);
}));
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
//---------------------------------------------------------------------------------------------------

//Seraching : checked [true]
const searching = async (req, res) => {
  try {
    // If the user provided one of these for searching
    const { userid, phonenumber, firstname } = req.body;

    // Create a query object based on the provided search parameters
    const query = {};
    if (userid) query.userid = userid;
    if (phonenumber) query.phonenumber = phonenumber;
    if (firstname) query.firstname = firstname;

    // Find the user in the database using the query object
    const data = await UserModel.findOne(query);

    // Check if a user was found
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
//------------------------------------------------------------------------------------------------------


//Singal Chat : checked [true]
const singlchat = async (req, res) => {
  try {
    // Getting the login userid and compare with the user2id if there is any chat
    const { userid1, userid2, firstname } = req.body;

    // See if there is any chat document containing both user IDs
    const existingChat = await ChatModel.findOne({
      $or: [
        { userid1: userid1, userid2: userid2 },
        { userid1: userid2, userid2: userid1 },
      ],
    });

    // If there was a chat document with both IDs, return the chat data
    if (existingChat) {
      res.status(200).json(existingChat);
    } else {
      // If there isn't a chat document between the main user and the other user, create a new chat document
      const newChat = new ChatModel({ userid1, userid2 });

      // Save the chat document in the database
      await newChat.save();

      res.status(201).json(newChat);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
//-------------------------------------------------------------------------------------------------------

//chatting for signal chat : checked [true]
const chattingSignal = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    // Handle chat messages
    socket.on('chat message', async (data) => {
      try {
        // Save the message to the database
        const chat = await ChatModel.findOneAndUpdate(
          {
            $or: [
              { userid1: data.sender, userid2: data.receiver },
              { userid1: data.receiver, userid2: data.sender },
            ],
          },
          { $push: { messages: { message: data.message, time: Date.now() } } },
          { upsert: true, new: true }
        );

        // Emit the message to the receiver
        socket.to(data.receiver).emit('chat message', data);
      } catch (error) {
        console.error('Error saving chat message:', error);
      }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
//---------------------------------------------------------------------------------------------------

//group chat : checked [true]
const groupchat = async (req, res) => {
  try {
    // Getting groupid from the body
    const { groupid } = req.body;

    // Find the group chat
    const chat = await ChatModel.findById(groupid);

    return res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
//----------------------------------------------------------------------------------------------------

//group chat socket : checked [true]
const chattingGroup = (io) => {
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
      try {
        // Save the message to the database
        const chat = await ChatModel.findOneAndUpdate(
          { groupid: data.groupid },
          { $push: { messages: { sender: data.sender, message: data.message, time: Date.now() } } },
          { new: true }
        );

        // Emit the message to the group
        socket.to(data.groupid).emit('group message', data);
      } catch (error) {
        console.error('Error saving group message:', error);
      }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
//-------------------------------------------------------------------------------------------------

//Video Call : checked [true]
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
          })
        })
      })
    };
//------------------------------------------------------------------------------------------------

//Call : checked [true]
const call = (io) =>{
    
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
  });
};
//------------------------------------------------------------------------------------------------

// Getting user info : checked [true]
const gettingUserInfo = async (req, res) => {
  const { userid, firstname, lastname, email, phonenumber } = req.body;
  try {
    const data = await UserModel.findOne({ userid, firstname, lastname, email, phonenumber });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user info' });
  }
};
//------------------------------------------------------------------------------------------------

// Delete chat : checked [true]
const delChat = async (req, res) => {
  const { chatid } = req.body;
  try {
    await ChatModel.findByIdAndDelete(chatid);
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting chat' });
  }
};
//------------------------------------------------------------------------------------------------

// Delete account : checked [true]
const delAccount = async (req, res) => {
  const { userid } = req.body;
  try {
    await UserModel.findByIdAndDelete(userid);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting account' });
  }
};
//------------------------------------------------------------------------------------------------

// Update User Info : checked [true]
const updateUserInfo = async (req, res) => {
  const { firstname, lastname, email, password, userid } = req.body;
  const newData = { firstname, lastname, email, password, userid };
  try {
    await UserModel.findByIdAndUpdate(userid, newData);
    res.json({ message: 'User info updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user info' });
  }
};
//------------------------------------------------------------------------------------------------

// Log Out : checked [true]
const logout = (req, res) => {
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
  }
};
//------------------------------------------------------------------------------------------------

// Forget Password : checked [true]
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
      from: '', // Add your Twilio phone number here
      to: user.phonenumber
    });
    // Save code and generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    await user.updateOne({ passwordResetToken: resetToken, verificationCode: code });
    // Send reset password email
    // Add your email sending logic here
    res.status(200).send('Verification code sent!');
  } catch (err) {
    res.status(500).send(err);
  }
};

//------------------------------------------------------------------------------------------------


module.exports = {login , signup , searching , singlchat , chattingSignal
   , groupchat , chattingGroup , call , videocall , logout , delChat , gettingUserInfo , UpdateUserInfo , 
  delAccount , ForgetPassword ,  };