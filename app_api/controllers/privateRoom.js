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
    var furniture = req.body;

    const possible_types = ['fotelj', 'stol', 'stolcek', 'light'];
    // update only furniture with the correct type
    furniture = furniture.filter(f => possible_types.includes(f.type));
    // fix all positions if they need fixing
    furniture.forEach(f => {
        f.position.x = Math.max(f.position.x, -0.5); f.position.x = Math.min(f.position.x, 0.5);
        f.position.y = Math.max(f.position.y, -0.5); f.position.y = Math.min(f.position.y, 0.5);
    });

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