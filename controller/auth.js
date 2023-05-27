const crypto = require('crypto');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const router = require('../routes/auth.js');
require('dotenv').config();


 //here we gonna upload infos for new ueser in db
 const mongoURI = 'monogodb://localhost:27017/userdb';
 //just checking for db connection is good with userdb
 mongoose
 .connect(mongoURI)
 .then(()=>{console.log('connected to userdb');})
 .catch((err)=>console.error('error connecting userdb'));
 //done checking
 //creating model (models are always capital letter)
 const UserModel = mongoose.model('user',collection);

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
const login = (req,res) => {
    try{
        //getting the input of email and password from body
        const {emaillogin , passwordlogin} = req.body;
        //storing what client wrote in body
        const userdata = {emaillogin , passwordlogin};
        //getting data from the model to compare with
        array.forEach(UserModel => { 
            const data = UserModel.find(email,password);
            if (emaillogin === data.email && passwordlogin === data.password)
            {
                console.log('login done seccussfully');
                router.get('/mainapp',main);
            }
            else if(emaillogin !=data.email || passwordlogin != data.password )
            {
                res.status(500).console.log('logging in error');
            }
        });
        

    }
    catch{
        console.log(error);
        res.status(500).json({message: error});
    }
}
const main = (req,res) =>{
    try{
        /**
         * will write the session to follow ueser account
         * sending user info to front
         * sending chats info to front 
         * we got return in the end
         */

    }
    catch{
        console.log(error);
        res.status(500).json({message: error}); 
    }
}
const chatcontroller = (req,res) =>{
    try{

    }
    catch{
        console.log(error);
        res.status(500).json({message: error}); 
    }
}
module.exports = {login , signup , main , chatcontroller};