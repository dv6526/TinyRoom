const mongoose = require('mongoose');
const Soba = mongoose.model('privateRoom');

const vrniSoboById = (req, res) => {
    Soba.findById(req.params.idSobe).exec((napaka, soba) => {
        if(!soba) {
            res.status(404).json({"sporočilo" : "Ne najdem sobe z idjem!"});
        } else if(napaka) {
            res.status(500).json(napaka);
        }
        res.status(200).json(soba);
    });
}

const sobaKreiraj = (req, res) => {
    //če obstaja uporabnik kreiraj njegovo sobo
    const username = req.params.username;
    const furniture = req.body;
  
    if (username) {
        Soba.updateOne({
            username: username
        },
        {  
            objects : furniture
        },
        (napaka, soba) => {
            if (napaka) {
                res.status(400).json(napaka);
            } else {
                res.status(201).json(soba);
            }
        });
    }else{
        res.status(404).json({"sporočilo" : "Uporabnik ne obstaja."});
    }
}

module.exports = {vrniSoboById, sobaKreiraj};