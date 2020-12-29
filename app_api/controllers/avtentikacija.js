const passport = require('passport');
const mongoose = require('mongoose');
//const delete = require('../../app');
const Uporabnik = mongoose.model('Uporabnik');
const registracija = (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).json({ "sporočilo": "Zahtevani so vsi podatki" });
  }

  Uporabnik.findOne({ "username": req.body.username }).exec((napaka, uporabnik) => {
    if (!uporabnik) {

      const uporabnik = new Uporabnik();
      uporabnik.username = req.body.username;
      uporabnik.email = req.body.email;
      uporabnik.rank = req.body.rank;
      uporabnik.nastaviGeslo(req.body.password);

      uporabnik.save(napaka => {
        if (napaka) {
          res.status(500).json(napaka);
        } else {
          res.status(200).json({ "zeton": uporabnik.generirajJwt(), "user": JSON.stringify(uporabnik)});
        }
      });
    } else {
      return res.status(400).json(napaka);
    }
  });

};

const prijava = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ "sporočilo": "Zahtevani so vsi podatki" });
  }
  passport.authenticate('local', (napaka, uporabnik, informacije) => {
    if (napaka)
      return res.status(500).json(napaka);
    if (uporabnik) {
      res.status(200).json({ "zeton": uporabnik.generirajJwt(), "user": JSON.stringify(uporabnik)});
    } else {
      res.status(401).json(informacije);
    }
  })(req, res);
};

module.exports = {
  registracija,
  prijava
};