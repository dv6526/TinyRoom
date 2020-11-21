const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');

const vrniUporabnike = (req, res) => {
    console.log(req.query.username + " " + req.query.password);
    Uporabnik.find({"username" : req.query.username, "password" : req.query.password}).exec((napaka, uporabnik) => {
        console.log(uporabnik.username);
        if(!uporabnik) {
            return res.status(404).json({"sporocilo" : "uporabnik ne obstaja"});
        } else if(napaka) {
            return res.status(500).json(napaka);
        } else {
            res.status(200).json(uporabnik);
        }
    })
};

const uporabnikKreiraj = (req, res) => {
    console.log(req.body.username + " " + req.body.password + " " + req.body.email);
    Uporabnik.create({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        rank : req.body.rank
    },(napaka, uporabnik) => {
        if (napaka) {
          res.status(400).json(napaka);
        } else {
          res.status(201).json(uporabnik);
        }
    });
}

module.exports = {vrniUporabnike, uporabnikKreiraj};