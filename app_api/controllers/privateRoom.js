const mongoose = require('mongoose');
const Soba = mongoose.model('privateRoom');

const vrniSoboByUsername = (req, res) => {
    Soba.findOne({ "owner": req.params.username }).exec((napaka, soba) => {
        if (!soba) {
            res.status(404).json({ "sporočilo": "Soba ne obstaja." });
        } else if (napaka) {
            res.status(500).json(napaka);
        } else {
            res.status(200).json(soba);
        }

    });
}

const sobaUpdate = (req, res) => {
    //če obstaja uporabnik kreiraj njegovo sobo
    if (!Array.isArray(req.body) || !req.params.username) {
        return res.status(400).json({ "sporočilo": "Zahtevani so vsi podatki." });
    }

    const username = req.params.username;
    var furniture = req.body;
    console.log(furniture);
    const possible_types = ['fotelj', 'stol', 'stolcek', 'light'];
    // update only furniture with the correct type
    furniture = furniture.filter(f => possible_types.includes(f.type));
    // fix all positions if they need fixing
    furniture.forEach(f => {
        f.position.x = Math.max(f.position.x, -0.5); f.position.x = Math.min(f.position.x, 0.5);
        f.position.y = Math.max(f.position.y, -0.5); f.position.y = Math.min(f.position.y, 0.5);
    });


    Soba.updateOne({
        owner: username
    },
        {
            objects: furniture
        },
        (napaka, soba) => {
            if (napaka) {
                res.status(500).json(napaka);
            } else if (!soba) {
                res.status(404).json({ "sporočilo": "Uporabnik ne obstaja." });
            } else {
                res.status(201).json();
            }
        });
}

module.exports = { vrniSoboByUsername, sobaUpdate };