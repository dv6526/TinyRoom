const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');
const avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  userProperty: 'payload',
  algorithms: ['HS256']
});

const ctrlUporabniki = require('../controllers/uporabniki');
const ctrlAvtentikacija = require('../controllers/avtentikacija');
const ctrlProfilePage = require('../controllers/profilePage');
const ctrlprivateRoom = require('../controllers/privateRoom');
const ctrlObject = require('../controllers/object');
const ctrlDb = require('../controllers/db');
const ctrlChatLogs = require('../controllers/chatLogs');

// User manipulation
router.post('/registracija', ctrlAvtentikacija.registracija);
router.post('/prijava', ctrlAvtentikacija.prijava);
router.get('/uporabniki/:ui/profile', ctrlUporabniki.getUserInfo);
router.put('/uporabniki/:idUporabnika/password', avtentikacija, ctrlProfilePage.changePassword);
router.put('/uporabniki/:idUporabnika/info', avtentikacija, ctrlProfilePage.changeProfileInfo);
router.put('/uporabniki/:ui/rank', avtentikacija, ctrlProfilePage.changeRank);
router.delete('/uporabniki/:idUporabnika', avtentikacija, ctrlProfilePage.terminateProfile);

//router.get('/uporabniki', ctrlUporabniki.vrniUporabnikaByUiPass);
//router.get('/uporabniki/:idUporabnika', ctrlUporabniki.vrniUporabnikaById);
//router.get('/uporabniki/getId/:ui', ctrlUporabniki.vrniUporabnikaByUi);
//router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);


// Private room manipulation
router.get('/privateRoom/:username', ctrlprivateRoom.vrniSoboByUsername);
router.post('/privateRoom/:username', avtentikacija, ctrlprivateRoom.sobaUpdate);

//router.get('/object/:idObjekta', ctrlObject.vrniObjectById);
//router.get('/object', ctrlObject.vrniLokacijo);


// Data base manipulation
router.delete('/db', ctrlDb.deleteAll);
router.put('/db/:ui/rank', ctrlProfilePage.changeRank);

// Chat manipulation
router.post('/chatLogs', ctrlChatLogs.sendChatLog);
router.get('/chatLogs', ctrlChatLogs.getChatLogs);
router.get('/messages', ctrlChatLogs.getMessages);

//router.post('/message', ctrlChatLogs.sendMessage);

/**
 * @swagger
 * /registracija:
 *  post:
 *    summary: Registracija novega uporabnika
 *    description: Registracija **novega uporabnika** s podatki o uporabniškem imenu, ranku, elektronskem naslovu in geslu. 
 *    tags: [Avtentikacija]
 *    requestBody:
 *      description: Podatki za registracijo
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: "#/components/schemas/UporabnikRegistracija"
 *    responses:
 *      "200":
 *        description: Uspešna registracija uporabnika z JWT žetonom v rezultatu.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/AvtentikacijaOdgovor"
 *      "400":
 *        description: Napaka zahteve, pri registraciji so obvezni uporabiško ime, elektronski naslov in geslo.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporočilo: Zahtevani so vsi podatki.
 *        
 */

/**
 * @swagger
 *   /prijava:
 *     post:
 *       summary: Prijava uporabnika
 *       description: Prijava **uporabnika** z elektronskim naslovom in geslom.
 *       tags: [Avtentikacija]
 *       requestBody:
 *         description: Prijavni podatki
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               $ref: "#/components/schemas/UporabnikPrijava"
 *       responses:
 *         "200":
 *           description: Uspešna prijava uporabnika z JWT žetonom in prijavljenim uporabnikom v rezultatu.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AvtentikacijaOdgovor"
 *         "400":
 *           description: Napaka zahteve, pri prijavi sta obvezna uporabniško ime in geslo.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Zahtevani so vsi podatki..
 *         "401":
 *           description: Napaka pri prijavi uporabnika.
 *           content:
 *             application/json:
 *               schema:
 *                $ref: "#/components/schemas/Napaka"
 *               example:
 *                sporočilo: Napačni podatki.
 *         "500":
 *           description: Napaka na strežniku pri preverjanju uporabnika.
 */


module.exports = router;
