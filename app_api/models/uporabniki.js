const mongoose = require('mongoose');

const uporabnikiShema = new mongoose.Schema({
    username : String,
    rank: String,
    email: String,
    password : String,
    bio : String
});

mongoose.model('Uporabnik', uporabnikiShema, "uporabnik");