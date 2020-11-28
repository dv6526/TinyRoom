const mongoose = require('mongoose');

const objectShema = new mongoose.Schema({
    type: String,
    position: {x: Number, y: Number}
});

const privateRoomShema = new mongoose.Schema({
    username: String,
    objects: [objectShema]
});

mongoose.model('privateRoom', privateRoomShema, 'prRoom');
module.exports = privateRoomShema;
