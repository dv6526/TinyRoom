var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.validateCookie, ctrlMain.index);
router.get('/private',ctrlMain.validateCookie,  ctrlMain.private);
router.get('/profile',ctrlMain.validateCookie,  ctrlMain.profile);

router.post('/register', ctrlMain.registerin);
router.post('/signin', ctrlMain.verification);
router.get('/logout', ctrlMain.logout);

router.post('/novoSporocilo', ctrlMain.novosporocilo);
router.post('/profile/update', ctrlMain.profileUpdate);

router.post('/profile/password')


module.exports = router;
