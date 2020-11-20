const express = require('express');
const router = express.Router();
const ctrlUporabniki = require('../controllers/uporabniki');
router.get('/uporabniki', ctrlUporabniki.vrniUporabnike);

module.exports = router;