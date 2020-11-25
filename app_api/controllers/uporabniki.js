const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');

const vrniUporabnike = (req, res) => {
    Uporabnik.find({"username" : req.query.username, "password" : req.query.password}).exec((napaka, uporabnik) => {
        if(!uporabnik) {
            return res.status(404).json({"sporocilo" : "uporabnik ne obstaja"});
        } else if(napaka) {
            return res.status(500).json(napaka);
        } else {
            res.status(200).json(uporabnik);
        }
    });
}

const vrniUporabnikaById = (req, res) => {
    //res.status(200).json({"req.params" : req.params.idUporabnika});
    
    Uporabnik.findById(req.params.idUporabnika).exec((napaka, uporabnik) => {
        if(!uporabnik) {
            res.status(404).json({"sporočilo" : "Ne najdem uporabnika z idjem!"})
        } else if(napaka) {
            res.status(500).json(napaka);
        }
        res.status(200).json(uporabnik);
    });
    
}

const uporabnikKreiraj = (req, res) => {
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

module.exports = {vrniUporabnike, uporabnikKreiraj, vrniUporabnikaById};