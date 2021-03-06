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
router.put('/uporabniki/:ui/rank', avtentikacija, ctrlAvtentikacija.isAdmin, ctrlProfilePage.changeRank);
router.delete('/uporabniki/:idUporabnika', avtentikacija, ctrlProfilePage.terminateProfile);

//router.get('/uporabniki', ctrlUporabniki.vrniUporabnikaByUiPass);
//router.get('/uporabniki/:idUporabnika', ctrlUporabniki.vrniUporabnikaById);
//router.get('/uporabniki/getId/:ui', ctrlUporabniki.vrniUporabnikaByUi);
//router.post('/uporabniki', ctrlUporabniki.uporabnikKreiraj);


// Private room manipulation
router.get('/privateRoom/:username', ctrlprivateRoom.vrniSoboByUsername);
router.post('/privateRoom/:username', avtentikacija, ctrlprivateRoom.sobaUpdate);

router.get('/preveriWSToken/:username/:token', ctrlAvtentikacija.preveriWSToken);
//router.get('/object/:idObjekta', ctrlObject.vrniObjectById);
//router.get('/object', ctrlObject.vrniLokacijo);


// Data base manipulation
router.delete('/db', ctrlDb.deleteAll);
router.put('/db/:ui/rank', ctrlProfilePage.changeRank);


// Chat manipulation
router.post('/chatLogs', ctrlChatLogs.sendChatLog);
router.get('/messages', avtentikacija, ctrlAvtentikacija.isAdmin, ctrlChatLogs.getMessages);

//router.get('/chatLogs', ctrlChatLogs.getChatLogs);
//router.post('/message', ctrlChatLogs.sendMessage);

/**
 * Varnostna shema dostopa
 * @swagger
 * components:
 *  securitySchemes:
 *   jwt:
 *    type: http
 *    scheme: bearer
 *    in: header
 *    bearerFormat: JWT
 */



/**
 * @swagger
 * /registracija:
 *  post:
 *    summary: Registracija novega uporabnika
 *    description: Registracija **novega uporabnika** s podatki o uporabni??kem imenu, ranku, elektronskem naslovu in geslu. 
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
 *        description: Uspe??na registracija uporabnika z JWT ??etonom v rezultatu.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/AvtentikacijaOdgovor"
 *      "400":
 *        description: Napaka zahteve, pri registraciji so obvezni uporabi??ko ime, elektronski naslov in geslo.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporo??ilo: Zahtevani so vsi podatki.
 *      "409":
 *        description: Napaka zahteve, uporabnik ??e obstaja.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporo??ilo: Uporabnik ??e obstaja.
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
 *           description: Uspe??na prijava uporabnika z JWT ??etonom in prijavljenim uporabnikom v rezultatu.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AvtentikacijaOdgovor"
 *         "400":
 *           description: Napaka zahteve, pri prijavi sta obvezna uporabni??ko ime in geslo.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporo??ilo: Zahtevani so vsi podatki.
 *         "401":
 *           description: Napaka pri prijavi uporabnika.
 *           content:
 *             application/json:
 *               schema:
 *                $ref: "#/components/schemas/Napaka"
 *               example:
 *                sporo??ilo: Napa??ni podatki.
 *         "500":
 *           description: Napaka na stre??niku pri preverjanju uporabnika.
 */

/**
 * @swagger
 *  /uporabniki/{ui}/profile:
 *   get:
 *    summary: Pridobivanje profila uporabnika
 *    description: Pridobivanje profila uporabnika s podanim uporabni??kem imenom.
 *    tags: [Uporabniki]
 *    parameters:
 *     - in: path
 *       name: ui
 *       description: uporabni??ko ime
 *       schema:
 *        type: string
 *       required: true
 *       example: student
 *    responses:
 *     "200":
 *      description: Uspe??no pridobljen profil uporabnik.
 *      content:
 *       application/json:
 *        schema:
 *          $ref: "#/components/schemas/ProfileInfo"
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
 *      description: Napaka zahteve, uporabnik ne obstaja.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *         sporo??ilo: Uporabnik ne obstaja.
 *     "500":
 *      description: Napaka na stre??niku pri dostopu do podatkovne baze.
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
 *      description: Uspe??no spremenjeno geslo uporabnika in JWT ??eton, ki se vrne v odgovoru.
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
 *      description: Napaka zahteve, zahtevanega uporabnika ni mogo??e najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *          sporo??ilo: Ne najdem uporabnika!
 *     "500":
 *      description: Napaka na stre??niku pri dostopu do podatkovne baze.
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
 *      description: Uspe??no spremenjeno geslo uporabnika in JWT ??eton, ki se vrne v odgovoru.
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
 *      description: Napaka zahteve, zahtevanega uporabnika, ki mu ??elimo spremeniti rank, ni mogo??e najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *          sporo??ilo: Ne najdem uporabnika!
 *     "500":
 *      description: Napaka na stre??niku pri dostopu do podatkovne baze.
 */

/**
* @swagger
*  /uporabniki/{ui}/rank:
*   put:
*    summary: Spreminjanje ranka izbranega uporabnika
*    description: Spremenitev **ranka uporabnika**.
*    tags: [Uporabniki]
*    parameters:
*     - in: path
*       name: ui
*       description: uporabni??ko ime uporabnika, ki mu ??elimo spremeniti rank
*       schema:
*        type: string
*       required: true
*       example: student
*     - in: query
*       name: id
*       description: ID uporabnika, ki zahteva spremembo ranka
*       schema:
*        type: string
*       required: true
*       example: 5ded18eb51386c3799833191
*    responses:
*     "200":
*      description: Uspe??no spremenjen rank uporabnika
*      content:
*       application/json:
*        schema:
*         $ref: "#/components/schemas/Sporocilo"
*        examples:
*         uspesno administriran:
*          $ref: "#/components/examples/UspesnoAdministriran"
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
*      description: Uporabnik, ki mu ??elimo spremeniti rank ne obstaja.
*      content:
*       application/json:
*        schema:
*         $ref: "#/components/schemas/Napaka"
*        example:
*         sporo??ilo: Uporabnik ne obstaja.
*     "500":
*      description: Napaka na stre??niku pri dostopu do podatkovne baze.
*/

/**
 * @swagger
 *  /uporabniki/{idUporabnika}:
 *   delete:
 *    summary: Brisanje uporabnika
 *    description: Brisanje **izbranega uporabnika**.
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
 *    responses:
 *     "204":
 *      description: Uspe??no izbrisan uporabnik.
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
 *      description: Napaka zahteve, zahtevanega uporabnika ni mogo??e najti.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *         sporo??ilo: Uporabnik ne obstaja.
 *     "500":
 *      description: Napaka pri brisanju uporabnika.
 */


/**
 * @swagger
 *  /privateRoom/{ui}:
 *   get:
 *    summary: Podatki o privatni sobi uporabnika
 *    description: Pridobivanje podatkov o privatni sobi uporabnika.
 *    tags: [Privatna soba]
 *    parameters:
 *     - in: path
 *       name: ui
 *       description: uporabni??ko ime
 *       schema:
 *        type: string
 *       required: true
 *       example: student
 *    responses:
 *     "200":
 *      description: Rezltat je podatek o privatni sobi zahtevanega uporabnika.
 *      content: 
 *       application/json:
 *        schema:
 *          $ref: "#/components/schemas/PrivateRoom"
 *     "404":
 *      description: Napaka zahteve, uporabnik ne obstaja.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        examples:
 *         uporabnik ne obstaja: 
 *           $ref: "#/components/examples/UporabnikNeObstaja"
 *         ne najdem sobe:
 *           $ref: "#/components/examples/SobaNeObstaja"
 *     "500":
 *      description: Napaka na stre??niku pri dostopu do podatkovne baze.
 */

/**
 * @swagger
 * /privateRoom/{ui}:
 *  post:
 *    summary: Posodabljanje in dodajanje predmetov privatne sobe
 *    description: Posodabljanje in dodajanje predmetov privatne sobe 
 *    tags: [Privatna soba]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: path
 *       name: ui
 *       description: uporabni??ko ime
 *       schema:
 *        type: string
 *       required: true
 *       example: student
 *    requestBody:
 *      description: Podatki o predmetih sobe
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *           type: array
 *           items:
 *            $ref: "#/components/schemas/FurnitureDTO"
 *    responses:
 *      "201":
 *        description: Uspe??no dodani in posodobljeni objekti privatne sobe.
 *      "400":
 *        description: Napaka zahteve, niso poslani vsi zahtevani podatki.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporo??ilo: Zahtevani so vsi podatki.
 *      "401":
 *       description: Napaka pri dostopu.
 *       content:
 *        application/json:
 *         schema:
 *          $ref: "#/components/schemas/Napaka"
 *         examples:
 *          ni zetona:
 *           $ref: "#/components/examples/NiZetona"
 *      "404":
 *        description: Uporabnik, ki mu ??elimo posodobiti privatno sobo, ne obstaja.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporo??ilo: Uporabnik ne obstaja.
 *      "500":
 *         description: Napaka na stre??niku pri preverjanju uporabnika.
 *        
 */

/**
* @swagger
*  /db:
*   delete:
*    summary: Brisanje podatkovne baze
*    description: Brisanje **podatkovne baze**.
*    tags: [Podatkovna baza]
*    responses:
*     "204":
*      description: Uspe??no izbrisan uporabnik.
*     "500":
*      description: Napaka pri brisanju podatkovne baze.
*/

/**
 * @swagger
 * /chatLogs:
 *  post:
 *    summary: Poslano sporo??ilo se shrani
 *    description: Zraven sporo??ila se po??ljejo ??e informacije kdo je sporo??ilo poslal in v kateri sobi.
 *    tags: [Sporo??ila]
 *    requestBody:
 *      description: Dodatne informacije poleg sporo??ila.
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: "#/components/schemas/Message"
 *    responses:
 *      "201":
 *        description: Sporo??ilo uspe??no shranjeno.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Message"
 *      "400":
 *        description: Zahtevani so vsi podatki.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Napaka"
 *            example:
 *              sporo??ilo: Zahtevani so podatki o imenu po??iljatelja, sporo??ilo ter soba.
 *      "500":
 *        description: Napaka na stre??niku pri shranjevanju sporo??ila.
 *        
 */

/**
 * @swagger
 *  /messages:
 *   get:
 *    summary: Pridobivanje poslanih sporo??il
 *    description: Pridobivanje vseh poslanih sporo??il.
 *    tags: [Sporo??ila]
 *    security:
 *     - jwt: []
 *    parameters:
 *     - in: query
 *       name: date
 *       description: datum
 *       schema:
 *        type: string
 *       required: true
 *       example: 2020-12-30
 *     - in: query
 *       name: page
 *       description: datum
 *       schema:
 *        type: string
 *       required: true
 *       example: 1
 *     - in: query
 *       name: perPage
 *       description: ??tevilo zadetkov na stran
 *       schema:
 *        type: string
 *       required: true
 *       example: 20
 *     - in: query
 *       name: id
 *       description: ID uporabnika, ki ??eli dostopati do poslanih sporo??il
 *       schema:
 *        type: string
 *       required: true
 *       example: 5fef5a5d1fd0226c4082f73d
 *    responses:
 *     "200":
 *      description: Uspe??no pridobljena sporo??ila.
 *      content:
 *       application/json:
 *        schema:       
 *         type: array
 *         items:       
 *            $ref: "#/components/schemas/Message"
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
 *      description: Ne najdem sporo??il z navedenim datumom.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *         sporo??ilo: Ne najdem sporo??il z navedenim datumom.
 *     "500":
 *      description: Napaka na stre??niku pri dostopu do podatkovne baze.
 */

/**
 * @swagger
 *  /preveriWSToken/{ui}/{token}:
 *   get:
 *    summary: Preverjanje ws tokena
 *    description: WS server avtenticira uporabnike glede na podan ws token.
 *    tags: [WS Token]
 *    parameters:
 *     - in: path
 *       name: ui
 *       description: uporabni??ko ime
 *       schema:
 *        type: string
 *       required: true
 *       example: student
 *     - in: path
 *       name: token
 *       description: Web Socket Token
 *       schema:
 *        type: string
 *       required: true
 *       example: f861390a1737
 *    responses:
 *     "200":
 *      description: Status ujemanja WS tokena.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/PreveriWSTokenOdgovor"
 *        examples:
 *         ws token se ujema: 
 *           $ref: "#/components/examples/Ujemanje"
 *         ws token se ne ujema:
 *           $ref: "#/components/examples/Neujemanje"
 *     "404":
 *      description: Napaka zahteve, uporabnik ne obstaja.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: "#/components/schemas/Napaka"
 *        example:
 *         sporo??ilo: Uporabnik ne obstaja.
 *     "500":
 *      description: Napaka na stre??niku pri dostopu do podatkovne baze.
 */



module.exports = router;
