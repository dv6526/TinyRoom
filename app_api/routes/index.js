const express = require('express');
const router = express.Router();
const ctrlUporabniki = require('../controllers/uporabniki');
router.get('/uporabniki', ctrlUporabniki.vrniUporabnike);
router.get('/uporabniki/:idUporabnika', ctrlUporabniki.vrniUporabnikaById);
router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);

const ctrlprivateRoom = require('../controllers/privateRoom');
router.get('/privateRoom/:idSobe', ctrlprivateRoom.vrniSoboById);
router.post('/privateRoom/:idUporabnika', ctrlprivateRoom.sobaKreiraj);

const ctrlObject = require('../controllers/object');
router.get('/object/:idObjekta', ctrlObject.vrniObjectById);
//router.get('/object', ctrlObject.vrniLokacijo);

const ctrlProfilePage = require('../controllers/profilePage');
router.delete('/profileRoom/:idUporabnika', ctrlProfilePage.terminateProfile);
router.put('/profileRoom/:idUporabnika/password', ctrlProfilePage.changePassword);
router.put('/profileRoom/:idUporabnika/info', ctrlProfilePage.changeProfileInfo);

module.exports = router;