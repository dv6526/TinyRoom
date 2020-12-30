const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');
const Soba = mongoose.model('privateRoom');
const chatLogs = mongoose.model('chatLogs');
const Messages = mongoose.model('messages');

const deleteAll = (req, res) => {
    Uporabnik.deleteMany({}, (napaka, uporabnik) => {
        if (!uporabnik) {
            console.log("Ni uporabnikov?");
        } else if (napaka) {
             res.status(500).json(napaka);
        }

    });
    Soba.deleteMany({}, (napaka, soba) => {
        if (!soba) {
            console.log("Ni sob?");
        } else if (napaka) {
            return res.status(500).json(napaka);
        }
    });
    Messages.deleteMany({}, (napaka, messages) => {
        if (!messages) {
            console.log("Ni sporocil (1/2)?");
        } else if (napaka) {
            return res.status(500).json(napaka);
        }
    });
    chatLogs.deleteMany({}, (napaka, logs) => {
        if (!logs) {
            console.log("Ni sporocil (2/2)?");
        } else if (napaka) {
            return res.status(500).json(napaka);
        }
    });
    chatLogs.create({});
    console.log("Izbrisano je bilo vse.");
    res.status(200).json({"sporocilo": "Izbrisani je bilo vse."});
}

module.exports = {deleteAll};
