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


//router.get('/uporabniki', ctrlUporabniki.vrniUporabnikaByUiPass);

router.post('/registracija', ctrlAvtentikacija.registracija);
router.post('/prijava', ctrlAvtentikacija.prijava);

router.get('/uporabniki/:idUporabnika', ctrlUporabniki.vrniUporabnikaById);
router.get('/uporabniki/:ui/profile', ctrlUporabniki.getUserInfo);
router.get('/uporabniki/getId/:ui', ctrlUporabniki.vrniUporabnikaByUi);

router.put('/uporabniki/:idUporabnika/password', avtentikacija, ctrlProfilePage.changePassword);
router.put('/uporabniki/:idUporabnika/info', avtentikacija, ctrlProfilePage.changeProfileInfo);
router.delete('/uporabniki/:idUporabnika', avtentikacija, ctrlProfilePage.terminateProfile);
//router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);


router.get('/privateRoom/:username', ctrlprivateRoom.vrniSoboByUsername);
router.post('/privateRoom/:username', ctrlprivateRoom.sobaUpdate);

router.get('/object/:idObjekta', ctrlObject.vrniObjectById);
//router.get('/object', ctrlObject.vrniLokacijo);

router.delete('/db', avtentikacija, ctrlDb.deleteAll);

router.post('/chatLogs', ctrlChatLogs.sendChatLog);
router.get('/chatLogs', ctrlChatLogs.getChatLogs);
//
router.post('/message', ctrlChatLogs.sendMessage);
router.get('/messages', ctrlChatLogs.getMessages);

module.exports = router;
