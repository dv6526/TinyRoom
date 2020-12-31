const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');
const avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  userProperty: 'payload',
  algorithms: ['HS256']
});

const ctrlUporabniki = require('../controllers/uporabniki');
const ctrlAvtentikacija = require('../controllers/avtentikacija');
const ctrlProfilePage = require('../controllers/profilePage');
const ctrlprivateRoom = require('../controllers/privateRoom');
const ctrlObject = require('../controllers/object');
const ctrlDb = require('../controllers/db');
const ctrlChatLogs = require('../controllers/chatLogs');

// User manipulation
router.post('/registracija', ctrlAvtentikacija.registracija);
router.post('/prijava', ctrlAvtentikacija.prijava);
router.get('/uporabniki/:ui/profile', ctrlUporabniki.getUserInfo);
router.put('/uporabniki/:idUporabnika/password', avtentikacija, ctrlProfilePage.changePassword);
router.put('/uporabniki/:idUporabnika/info', avtentikacija, ctrlProfilePage.changeProfileInfo);
router.put('/uporabniki/:ui/rank', avtentikacija, ctrlProfilePage.changeRank);
router.delete('/uporabniki/:idUporabnika', avtentikacija, ctrlProfilePage.terminateProfile);

//router.get('/uporabniki', ctrlUporabniki.vrniUporabnikaByUiPass);
//router.get('/uporabniki/:idUporabnika', ctrlUporabniki.vrniUporabnikaById);
//router.get('/uporabniki/getId/:ui', ctrlUporabniki.vrniUporabnikaByUi);
//router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);


// Private room manipulation
router.get('/privateRoom/:username', ctrlprivateRoom.vrniSoboByUsername);
router.post('/privateRoom/:username', avtentikacija, ctrlprivateRoom.sobaUpdate);

//router.get('/object/:idObjekta', ctrlObject.vrniObjectById);
//router.get('/object', ctrlObject.vrniLokacijo);


// Data base manipulation
router.delete('/db', ctrlDb.deleteAll);
router.put('/db/:ui/rank', ctrlProfilePage.changeRank);

// Chat manipulation
router.post('/chatLogs', ctrlChatLogs.sendChatLog);
router.get('/chatLogs', ctrlChatLogs.getChatLogs);
router.get('/messages', ctrlChatLogs.getMessages);

//router.post('/message', ctrlChatLogs.sendMessage);


module.exports = router;
