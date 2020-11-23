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
router.get('/object/:idObjekta', ctrlObject.vrniObject);
router.get('/object', ctrlObject.vrniLokacijo);

module.exports = router;