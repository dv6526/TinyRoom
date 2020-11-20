const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');

const vrniUporabnike = (req, res) => {
    res.status(200).json({"status": "uspešno"});
};

module.exports = {vrniUporabnike};