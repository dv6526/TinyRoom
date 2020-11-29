const mongoose = require('mongoose');
const chatLogs = mongoose.model('chatLogs');

const chatIzbrisiIzbranega = (req, res) => {
    const idSporocila = req.params;
    if (!idSporocila) {
        return res.status(404).json({
            "sporočilo":
                "Ne najdem id sporočila."
        });
    }
    chatLogs
        .findById(idSporocila)
        .exec((napaka, sporocila) => {
            if (!sporocila) {
                return res.status(404).json({"sporočilo": "Ne najdem sporočila."});
            } else if (napaka) {
                return res.status(500).json(napaka);
            }

            if (!sporocila.id(idSporocila)) {
                return res.status(404).json({"sporočilo": "Ne najdem id sporočila."});
            } else {
                sporocila.id(idSporocila).remove();
                sporocila.save((napaka) => {
                    if (napaka) {
                        return res.status(500).json(napaka);
                    }
                });
            }
        });
}

module.exports = {chatIzbrisiIzbranega};