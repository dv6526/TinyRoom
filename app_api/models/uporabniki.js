const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const uporabnikiShema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    rank: { type: String, default: "" },
    email: { type: String, required: true },
    profile_picture: { type: String, "default": "" },
    bio_title: { type: String, "default": 'Default bio title' },
    bio: { type: String, "default": 'This is default bio' },
    chosen_skin: { type: String, "default": "bunny" },
    zgoscenaVrednost: { type: String, required: true },
    nakljucnaVrednost: { type: String, required: true }
});

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
        // rank: this.rank,
        exp: parseInt(datumPoteka.getTime() / 1000, 10)
    }, process.env.JWT_GESLO);
};

mongoose.model('Uporabnik', uporabnikiShema, "uporabnik");
