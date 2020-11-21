const express = require('express');
const router = express.Router();
const ctrlUporabniki = require('../controllers/uporabniki');
router.get('/uporabniki', ctrlUporabniki.vrniUporabnike);
router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);

module.exports = router;