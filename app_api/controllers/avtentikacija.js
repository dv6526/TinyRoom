const passport = require('passport');
const mongoose = require('mongoose');
//const delete = require('../../app');
const Uporabnik = mongoose.model('Uporabnik');
const Soba = mongoose.model('privateRoom');
const atob = require('atob');
var createError = require('http-errors');

const registracija = (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).json({ "sporočilo": "Zahtevani so vsi podatki." });
  }

  Uporabnik.findOne({ "username": req.body.username }).exec((napaka, uporabnik) => {
    if (!uporabnik) {

      const uporabnik = new Uporabnik();
      uporabnik.username = req.body.username;
      uporabnik.email = req.body.email;
      uporabnik.rank = 'user';
      uporabnik.nastaviGeslo(req.body.password);
      uporabnik.generirajWSToken();

      Soba.create({
        owner: req.body.username,
        objects: []
      }, (napaka, soba) => {
        if (napaka) {
          console.log('napaka pri kreiranju sobe', napaka);
        }
        console.log('Soba je kreirana', soba);
      });

      uporabnik.save((napaka, uporabnik) => {
        if (napaka) {
          res.status(500).json(napaka);
        } else {
          let userData = {
            username: uporabnik.username,
            rank: uporabnik.rank,
            email: uporabnik.email,
            profile_picture: uporabnik.profile_picture,
            bio_title: uporabnik.bio_title,
            bio: uporabnik.bio,
            chosen_skin: uporabnik.chosen_skin,
            ws_token: uporabnik.ws_token,
            _id: uporabnik._id
          }
          res.status(200).json({ "zeton": uporabnik.generirajJwt(), "user": JSON.stringify(userData) });
        }
      });
    } else {
      return res.status(409).json({ "sporočilo": "Uporabnik že obstaja." });
    }
  });

};

const prijava = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ "sporočilo": "Zahtevani so vsi podatki." });
  }
  passport.authenticate('local', (napaka, uporabnik, informacije) => {
    if (napaka)
      return res.status(500).json(napaka);
    if (uporabnik) {

      uporabnik.generirajWSToken();
      uporabnik.save((napaka, uporabnik) => {
        let userData = {
          username: uporabnik.username,
          rank: uporabnik.rank,
          email: uporabnik.email,
          profile_picture: uporabnik.profile_picture,
          bio_title: uporabnik.bio_title,
          bio: uporabnik.bio,
          chosen_skin: uporabnik.chosen_skin,
          ws_token: uporabnik.ws_token,
          _id: uporabnik._id
        }
        res.status(200).json({ "zeton": uporabnik.generirajJwt(), "user": JSON.stringify(userData) });
      })

    } else {
      res.status(401).json(informacije);
    }
  })(req, res);
};

const preveriWSToken = (req, res) => {
  let username = req.params.username;
  let token_to_check = req.params.token;

  Uporabnik.findOne({ "username": username }).exec((napaka, uporabnik) => {

    if (napaka) {
      return res.status(500);
    } else if (!uporabnik) {
      return res.status(404).json({ "sporočilo": "Uporabnik ne obstaja." });
    } else {
      return res.status(200).json({
        "success": token_to_check == uporabnik.ws_token
      })
    }

  })
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

function isAdmin(req, res, next) {
  let rank = parseJwt(req.header('Authorization'))['rank'];
  if(rank == 'admin') {
    console.log("IS ADMIN: Uspešno avtenticiranje");
    next()
  } else {
    console.log("IS ADMIN: Zahteva ni prišla s strani administratorja. Zavrnjeno!");
    next(createError(401));
  }
  // Uporabnik.findById(req.query.id).exec((error, profile) => {
  //   if (error) {
  //     console.log("IS ADMIN: Nekaj je šlo narobe pri iskanju uporabnika!");
  //     //res.status(500).json(error);
  //     next(createError(500));
  //   } else if (!profile) {
  //     console.log("IS ADMIN: Uporabnik ne obstaja!");
  //     //res.status(404).json(error);
  //     next(createError(401));
  //   } else {
  //     if (profile.rank == "admin") {
  //       console.log("IS ADMIN: Uspešno avtenticiranje");
  //       next()
  //     } else {
  //       console.log("IS ADMIN: Zahteva ni prišla s strani administratorja. Zavrnjeno!");
  //       //res.status(401).json({"sporocilo":"Za dostop potrebujes administratorske pravice"});
  //       next(createError(401));
  //     }
  //   }
  // });
}

module.exports = {
  registracija,
  prijava,
  isAdmin,
  preveriWSToken
};
