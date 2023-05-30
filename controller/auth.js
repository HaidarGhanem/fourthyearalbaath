const crypto = require('crypto');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const router = require('../routes/auth.js');
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
}
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
        //we will see if there an old chat with this user
        //if there isnt create new chat with own chatid 
        //connect the userid1 & userid2 with chatid to store the chat
        //controller for making a socket.io conn with the chat
        //if there was an chat with the userid2 upload it from ChatModel.chatdb
        //----------------------------------------------------------------------
        

        //getting the login userid and compare with the user2id if there is any chat
        const {userid1 , userid2 , firstname} = req.body;
        const chatdata = {userid1 , userid2 , firstname};
        //see if there any chatmodel contains in its collection both of ids
        array.forEach(ChatModel => { 
            const data = ChatModel.find({userid1 , userid2},(err,doc)=>{
            if (chatdata.userid1 === data.userid1 && chatdata.userid2 === data.userid2)
            {
                const thischat = ChatModel.get
                return (data);
            }
            else if(userdata.userid != data.userid || userdata.phonenumber != data.phonenumber || userdata.firstname != data.firstname )
            {
                res.status(500).console.log('couldnt find user');
            }});
        });
    }
    catch{

    }
}
module.exports = {login , signup , searching , signalchat};