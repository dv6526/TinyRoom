const express = require('express');
const router = express.Router();
const ctrlUporabniki = require('../controllers/uporabniki');
router.get('/uporabniki', ctrlUporabniki.vrniUporabnike);
router.get('/uporabniki/:idUporabnika', ctrlUporabniki.vrniUporabnikaById);
router.get('/uporabniki/getId/:ui', ctrlUporabniki.vrniUporabnikaByUi);
router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);

const ctrlprivateRoom = require('../controllers/privateRoom');
router.get('/privateRoom/:idSobe', ctrlprivateRoom.vrniSoboById);
router.post('/privateRoom/:idUporabnika', ctrlprivateRoom.sobaKreiraj);

const ctrlObject = require('../controllers/object');
router.get('/object/:idObjekta', ctrlObject.vrniObjectById);
//router.get('/object', ctrlObject.vrniLokacijo);

const ctrlProfilePage = require('../controllers/profilePage');
router.delete('/profile/:idUporabnika', ctrlProfilePage.terminateProfile);
router.put('/profile/:idUporabnika/password', ctrlProfilePage.changePassword);
router.put('/profile/:idUporabnika/info', ctrlProfilePage.changeProfileInfo);

const ctrlChatLogs = require('../controllers/chatLogs');
//router.post('/chatLogs/:idSporocila', ctrlChatLogs.chatKreiraj);
//router.get('/chatLogs/:idSporocila', ctrlChatLogs.vrniChatById);
//router.delete('/chatLogs/:idSporocila', ctrlChatLogs.chatIzbrisiIzbranega);

module.exports = router;