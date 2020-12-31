const passport = require('passport');
const LokalnaStrategija = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');

passport.use(
  new LokalnaStrategija(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, pkKoncano) => {
      Uporabnik.findOne(
        { username: username },
        (napaka, uporabnik) => {
          if (napaka)
            return pkKoncano(napaka);
          if (!uporabnik) {
            return pkKoncano(null, false, {
              "sporočilo": "Napačni podatki."
            });
          }
          if (!uporabnik.preveriGeslo(password)) {
            return pkKoncano(null, false, {
              "sporočilo": "Napačni podatki."
            });
          }
          return pkKoncano(null, uporabnik);
        }
      );
    }
  )
);