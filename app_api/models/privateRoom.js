const mongoose = require('mongoose');

const objectShema = new mongoose.Schema({
    objectName: String,
    pixelCoordinate: {type: [Number], index: '2dsphere'}
});

const privateRoomShema = new mongoose.Schema({
    username: String,
    objects: [objectShema]
});

mongoose.model('privateRoom', privateRoomShema, 'prRoom');
module.exports = privateRoomShema;
