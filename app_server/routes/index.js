var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/',         ctrlMain.register);
router.get('/private',  ctrlMain.register);
router.get('/profile',  ctrlMain.register);
router.get('/register', ctrlMain.register);

router.post('/',         ctrlMain.verification);
router.post('/private',  ctrlMain.verification);
router.post('/profile',  ctrlMain.verification);
router.post('/register', ctrlMain.verification);

router.post('/novoSporocilo', ctrlMain.novosporocilo);

module.exports = router;
