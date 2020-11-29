const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');
const Soba = mongoose.model('privateRoom');
const chatLogs = mongoose.model('chatLogs');

const deleteAll = (req, res) => {
    Uporabnik.deleteMany({}, (napaka, uporabnik) => {
        if (!uporabnik) {
            return res.status(404).json({ "sporocilo": "Ni uporabnikov?" });
        } else if (napaka) {
             return res.status(500).json(napaka);
        }

    });
    Soba.deleteMany({}, (napaka, soba) => {
        if (!soba) {
            return res.status(404).json({ "sporocilo": "Ni sob?" });
        } else if (napaka) {
            return res.status(500).json(napaka);
        }
    });
    chatLogs.deleteMany({}, (napaka, logs) => {
        if (!logs) {
            return res.status(404).json({ "sporocilo": "Ni sporocil?" });
        } else if (napaka) {
            return res.status(500).json(napaka);
        }
    });
    res.status(200).json({"sporocilo": "Izbrisani je bilo vse."});
}

module.exports = {deleteAll};