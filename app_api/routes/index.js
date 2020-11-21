const express = require('express');
const router = express.Router();
const ctrlUporabniki = require('../controllers/uporabniki');
router.get('/uporabniki', ctrlUporabniki.vrniUporabnike);
router.get('/uporabniki/:idUporabnika', ctrlUporabniki.vrniUporabnikaById);
router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);

module.exports = router;