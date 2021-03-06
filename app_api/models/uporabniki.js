const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
* @swagger
* components:
*  schemas:
*   UporabnikPrijava:
*    type: object
*    description: Podatki uporabnika za prijavo
*    properties:
*     username:
*      type: string
*      description: uporabniško ime
*      example: profesor
*     password:
*      type: string
*      description: geslo
*      format: password
*      example: profesor
*    required:
*     - username
*     - password
*   UporabnikRegistracija:
*    type: object
*    description: Podatki uporabnika za registracijo
*    properties:
*     username:
*      type: string
*      description: uporabniško ime
*      example: student
*     rank:
*      type: string
*      description: rank
*      example: user
*     email:
*      type: string
*      description: elektronski naslov
*      example: student@student.net
*     password:
*      type: string
*      format: password
*      example: test
*    required:
*     - username
*     - email
*     - password
*   ProfileInfo:
*    type: object
*    description: podatki o profilu uporabnika
*    properties:
*     bio_title:
*      type: string
*      description: Bio title
*      example: This is my bio title.
*     bio:
*      type: string
*      description: biografija uporabnika.
*      example: This is my bio.
*     profile_picture:
*      type: string
*      description: ime profilne slike uporabnika
*      example: profile_picture.jpg
*     chosen skin:
*      type: string
*      description: sprite_idx profilne slike
*      example: bunny
*   AvtentikacijaOdgovor:
*    type: object
*    description: Rezultat uspešne avtentikacije uporabnika
*    properties:
*     zeton:
*      type: string
*      description: JWT žeton
*      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZhMjBlZDlhZGM0MzIyNmY0NjhkZjMiLCJlbGVrdHJvbnNraU5hc2xvdiI6ImRlamFuQGxhdmJpYy5uZXQiLCJpbWUiOiJEZWphbiBMYXZiacSNIiwiZGF0dW1Qb3Rla2EiOjE1Nzc5NTU2NjMsImlhdCI6MTU3NzM1MDg2M30.PgSpqjK8qD2dHUsXKwmqzhcBOJXUUwtIOHP3Xt6tbBA
*     user: 
*      type: object
*      properties:
*         username:
*          type: string
*         rank:
*          type: string
*         email:
*          type: string
*         profile_picture:
*          type: string
*         bio_title:
*          type: string
*         bio:
*          type: string
*         chosen_skin:
*          type: string 
*         _id:
*           type: string
*     required:
*      - zeton
*      - user
*   PrivateRoom:
*    type: object
*    description: podatki o privatni sobi
*    properties:
*     user: 
*      type: object
*      properties:
*         _id:
*          type: string
*         owner:
*          type: string
*         objects:
*          type: array
*          items:
*           $ref: "#/components/schemas/Object"
*   Object:
*    type: object
*    description: podatki o objektu, ki se nahaja v privatni sobi
*    properties:
*     position: 
*      type: object
*      properties:
*         _id:
*          type: string
*         type:
*          type: string
*         position:
*          type: object
*          properties:
*           x:
*            type: integer
*           y:
*            type: integer
*   Message:
*    type: object
*    description: podatki o sporočilu
*    properties:
*      name:
*       type: string
*      date:
*       type: string
*      body:
*       type: string
*      room:
*       type: string
*   FurnitureDTO:
*    type: object
*    description: podatki o objektu, ki se nahaja v privatni sobi
*    properties:
*     position: 
*      type: object
*      properties:
*         type:
*          type: string
*         position:
*          type: object
*          properties:
*           x:
*            type: integer
*           y:
*            type: integer
*   ZetonOdgovor:
*    type: object
*    description: Rezultat uspešne sprembe gesla uporabnika
*    properties:
*     zeton:
*      type: string
*      description: JWT žeton
*      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZhMjBlZDlhZGM0MzIyNmY0NjhkZjMiLCJlbGVrdHJvbnNraU5hc2xvdiI6ImRlamFuQGxhdmJpYy5uZXQiLCJpbWUiOiJEZWphbiBMYXZiacSNIiwiZGF0dW1Qb3Rla2EiOjE1Nzc5NTU2NjMsImlhdCI6MTU3NzM1MDg2M30.PgSpqjK8qD2dHUsXKwmqzhcBOJXUUwtIOHP3Xt6tbBA
*     required:
*      - zeton
*   Napaka:
*    type: object
*    description: Podrobnosti napake
*    required:
*     - sporočilo
*    properties:
*     sporočilo:
*      type: string
*    example:
*     sporočilo: Parametri so obvezni.
*   Sporocilo:
*    type: object
*    description: Podrobnosti o uspešni zahtevi.
*    required:
*     - sporočilo
*    properties:
*     sporočilo:
*      type: string
*    example:
*     sporočilo: Uspešna akcija.
*   PreveriWSTokenOdgovor:
*    type: object
*    description: Ujemanje WS tokena.
*    required:
*     - success
*    properties:
*     success:
*      type: boolean
*    example:
*     success: true.
*/

/**
 * @swagger
 *  components:
 *   examples:
 *    VsiPodatki:
 *     summary: zahtevani so vsi podatki
 *     value:
 *      sporočilo: Zahtevani so vsi podatki.
 *    NiZetona:
 *     summary: ni JWT žetona
 *     value:
 *      sporočilo: "UnauthorizedError: No authorization token was found."
 *    UspesnoAdministriran:
 *     summary: Uporabniku smo uspešno spremenili rank.
 *     value:
 *      sporočilo: "sporočilo: Uspešno administriran uporabnik."
 *    UporabnikNeObstaja:
 *     summary: Uporabnik ne obstaja.
 *     value:
 *      sporočilo: "sporočilo: Uporabnik ne obstaja."
 *    SobaNeObstaja:
 *     summary: Soba ne obstaja.
 *     value:
 *      sporočilo: "sporočilo: Soba ne obstaja."
 *    NapakaDodajanje:
 *     summary: Napaka pri dodajanju sporočila.
 *     value:
 *      sporočilo: "sporočilo: Napaka pri dodajanju sporočila."
 *    NapakaShranjevanje:
 *     summary: Napaka pri shranjevanju sporočila.
 *     value:
 *      sporočilo: "sporočilo: Napaka pri shranjevanju sporočila."
 *    Ujemanje:
 *     summary: WS token se ujema.
 *     value:
 *      success: "true"
 *    Neujemanje:
 *     summary: WS token se ne ujema.
 *     value:
 *      success: "false"
 */

const uporabnikiShema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    rank: { type: String, default: "" },
    email: { type: String, required: true },
    profile_picture: { type: String, "default": "" },
    bio_title: { type: String, "default": 'Default bio title' },
    bio: { type: String, "default": 'This is default bio' },
    chosen_skin: { type: String, "default": "bunny" },
    zgoscenaVrednost: { type: String, required: true },
    nakljucnaVrednost: { type: String, required: true },
    ws_token: { type: String }
});

uporabnikiShema.methods.generirajWSToken = function () {
    let token = crypto.randomBytes(6).toString('hex');
    this.ws_token = token;
    // debug outprint
    console.log('Generiral se je nov WS Token', this.ws_token, 'for', this.username);
    return this.ws_token;
}

uporabnikiShema.methods.preveriWSToken = function (token) {
    return this.ws_token = token;
}

uporabnikiShema.methods.nastaviGeslo = function (geslo) {
    this.nakljucnaVrednost = crypto.randomBytes(16).toString('hex');
    this.zgoscenaVrednost = crypto
        .pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000, 64, 'sha512')
        .toString('hex');
};

uporabnikiShema.methods.preveriGeslo = function (geslo) {
    let zgoscenaVrednost = crypto
        .pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000, 64, 'sha512')
        .toString('hex');
    return this.zgoscenaVrednost == zgoscenaVrednost;
};

uporabnikiShema.methods.generirajJwt = function () {
    const datumPoteka = new Date();
    datumPoteka.setDate(datumPoteka.getDate() + 7);
    return jwt.sign({
        username: this.username,
        email: this.email,
        my_id: this._id,
        // sprite_idx: this.chosen_skin,
        rank: this.rank,
        exp: parseInt(datumPoteka.getTime() / 1000, 10)
    }, process.env.JWT_GESLO);
};

mongoose.model('Uporabnik', uporabnikiShema, "uporabnik");
