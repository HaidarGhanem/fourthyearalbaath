const express = require ( 'express');
const router = express.Router();
const {login , signup , searching , singlchat , chattingSignal
    , groupchat , chattingGroup , call , videocall , logout , delChat , gettingUserInfo , UpdateUserInfo , 
   delAccount , ForgetPassword ,  } = require('../controllers/auth.js');
router.post('/signup',signup);
router.post('/login',login);
router.get('/searching',searching);
router.get('/singlechat',singlchat);
router.get('/groupchat' ,groupchat);
router.get('/gettingUserInfo',gettingUserInfo);
router.delete('/delChat',delChat);
router.delete('/delAccount' ,delAccount);
router.put('/UpdateUserInfo',UpdateUserInfo);
router.get('/logout',logout);
router.post('/ForgetPasseord',ForgetPassword);
router.get('/updateOne',updateOne);

module.exports = router;