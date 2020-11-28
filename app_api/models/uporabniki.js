const mongoose = require('mongoose');
const privateRoomShema = require('./privateRoom');

const uporabnikiShema = new mongoose.Schema({
    username : String,
    rank: String,
    email: String,
    password: String,
    profile_picture: String,
    bio_title: {type: String, default: ''},
    bio: {type: String, default: ''},
    chosen_skin: String,
    private_room: [privateRoomShema]
});

mongoose.model('Uporabnik', uporabnikiShema, "uporabnik");
