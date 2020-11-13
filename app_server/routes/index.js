var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);

router.get('/private', ctrlMain.private);

router.get('/profile', ctrlMain.profile);

router.get('/register', ctrlMain.register);

router.post('/novoSporocilo', ctrlMain.novosporocilo);

module.exports = router;
