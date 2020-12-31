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
 *      "409":
 *        description: Napaka zahteve, uporabnik že obstaja.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporočilo: Uporabnik že obstaja.
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
 *                 sporočilo: Zahtevani so vsi podatki.
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

/**
 * @swagger
 *  /uporabniki/{ui}/profile:
 *   get:
 *    summary: Pridobivanje profila uporabnika
 *    description: Pridobivanje profila uporabnika s podanim uporabniškem imenom.
 *    tags: [Uporabniki]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: ui
 *       description: uporabniško ime
 *       schema:
 *        type: string
 *       required: true
 *       example: student
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s podrobnostmi uporabniškega profila v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/ProfileInfo"
 *     "404":
 *      description: Napaka zahteve, uporabnik ne obstaja.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *         sporočilo: Uporabnik ne obstaja.
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

/**
 * @swagger
 *  /uporabniki/{idUporabnika}/password:
 *   put:
 *    summary: Posodabljanje gesla izbranega uporabnika
 *    description: Posodobitev **gesla uporabnika**.
 *    tags: [Uporabniki]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: idUporabnika
 *       description: ID uporabnika
 *       schema:
 *        type: string
 *       required: true
 *       example: 5ded18eb51386c3799833191
 *    responses:
 *     "200":
 *      description: Uspešno spremenjeno geslo uporabnika in JWT žeton, ki se vrne v odgovoru.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/ZetonOdgovor"
 *     "401":
 *      description: Napaka pri dostopu.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         ni zetona:
 *          $ref: "#/components/examples/NiZetona"
 *     "404":
 *      description: Napaka zahteve, zahtevanega uporabnika ni mogoče najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *         ne najdem uporabnika:
 *          sporočilo: Ne najdem uporabnika!
 *     "500":
 *      description: Napaka pri iskanju lokacije.
 */

/**
 * @swagger
 *  /uporabniki/{idUporabnika}/info:
 *   put:
 *    summary: Posodabljanje profila izbranega uporabnika
 *    description: Posodobitev **profila uporabnika**.
 *    tags: [Uporabniki]
 *    requestBody:
 *      description: Podatki za registracijo
 *      required: false
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: "#/components/schemas/ProfileInfo"
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: idUporabnika
 *       description: ID uporabnika
 *       schema:
 *        type: string
 *       required: true
 *       example: 5ded18eb51386c3799833191
 *    responses:
 *     "200":
 *      description: Uspešno spremenjeno geslo uporabnika in JWT žeton, ki se vrne v odgovoru.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/ZetonOdgovor"
 *     "401":
 *      description: Napaka pri dostopu.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *         ni zetona:
 *          $ref: "#/components/examples/NiZetona"
 *     "404":
 *      description: Napaka zahteve, zahtevanega uporabnika ni mogoče najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *         ne najdem uporabnika:
 *          sporočilo: Ne najdem uporabnika!
 *     "500":
 *      description: Napaka pri iskanju lokacije.
 */

module.exports = router;
