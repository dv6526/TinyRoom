const mongoose = require('mongoose');
const privateRoomShema = require('./privateRoom');

const uporabnikiShema = new mongoose.Schema({
    username : {type: String, required: true},
    rank: {type: String, default: "user"},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profile_picture: {type: String, "default": "default.png"},
    bio_title: {type: String, "default": 'Default bio title'},
    bio: {type: String, "default": 'This is default bio'},
    chosen_skin: {type: String, "default": "bunny"},
    private_room: [privateRoomShema]
});

mongoose.model('Uporabnik', uporabnikiShema, "uporabnik");
