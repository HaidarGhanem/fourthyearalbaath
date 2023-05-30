const express = require ( 'express');
const router = express.Router();
const {login , signup , searching } = require('../controllers/auth.js');
router.post('/signup',signup);
router.post('/login',login);
router.get('/searching',searching);
module.exports = router;