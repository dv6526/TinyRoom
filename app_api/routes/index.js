const express = require('express');
const router = express.Router();
const ctrlUporabniki = require('../controllers/uporabniki');
const ctrlAvtentikacija = require('../controllers/avtentikacija');

//router.get('/uporabniki', ctrlUporabniki.vrniUporabnikaByUiPass);
/* Avtentikacija */
router.post('/registracija', ctrlAvtentikacija.registracija);
router.post('/prijava', ctrlAvtentikacija.prijava);

router.get('/uporabniki/:idUporabnika', ctrlUporabniki.vrniUporabnikaById);
router.get('/uporabniki/:ui/profile', ctrlUporabniki.getUserInfo);
router.get('/uporabniki/getId/:ui', ctrlUporabniki.vrniUporabnikaByUi);
router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);

const ctrlprivateRoom = require('../controllers/privateRoom');
router.get('/privateRoom/:username', ctrlprivateRoom.vrniSoboByUsername);
router.post('/privateRoom/:username', ctrlprivateRoom.sobaKreiraj);

const ctrlObject = require('../controllers/object');
router.get('/object/:idObjekta', ctrlObject.vrniObjectById);
//router.get('/object', ctrlObject.vrniLokacijo);

const ctrlProfilePage = require('../controllers/profilePage');
router.delete('/profile/:idUporabnika', ctrlProfilePage.terminateProfile);
router.put('/profile/:idUporabnika/password', ctrlProfilePage.changePassword);
router.put('/profile/:idUporabnika/info', ctrlProfilePage.changeProfileInfo);

const ctrlDb = require('../controllers/db');
router.get('/db/deleteAll', ctrlDb.deleteAll);

const ctrlChatLogs = require('../controllers/chatLogs');
router.post('/chatLogs', ctrlChatLogs.sendChatLog);
router.get('/chatLogs', ctrlChatLogs.getChatLogs);
//
router.post('/message', ctrlChatLogs.sendMessage);
router.get('/messages', ctrlChatLogs.getMessages);

module.exports = router;
