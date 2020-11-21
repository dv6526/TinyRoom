var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/',         ctrlMain.index);
router.get('/private',  ctrlMain.private);
router.get('/profile',  ctrlMain.profile);

router.post('/register', ctrlMain.registerin);
router.post('/signin', ctrlMain.verification);

router.get('/novoSporocilo', ctrlMain.novosporocilo);

module.exports = router;
