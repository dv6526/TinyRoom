const mongoose = require('mongoose');

const uporabnikiShema = new mongoose.Schema({
    username : {type: String, required: true, unique: true},
    rank: {type: String, default: "user"},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profile_picture: {type: String, "default": ""},
    bio_title: {type: String, "default": 'Default bio title'},
    bio: {type: String, "default": 'This is default bio'},
    chosen_skin: {type: String, "default": "bunny"}
});

mongoose.model('Uporabnik', uporabnikiShema, "uporabnik");
