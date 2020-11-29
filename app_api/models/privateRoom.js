const mongoose = require('mongoose');

const objectShema = new mongoose.Schema({
    type: String,
    position: {
        x: {type: Number, "default": 0, min: -0.5, max: 0.5},
        y: {type: Number, "default": 0, min: -0.5, max: 0.5}
    }
});

const privateRoomShema = new mongoose.Schema({
    owner: {type: String, required: true},
    objects: [objectShema]
});

mongoose.model('privateRoom', privateRoomShema, 'prRoom');
module.exports = privateRoomShema;
