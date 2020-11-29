const mongoose = require('mongoose');
/*
const chatLogsShema = new mongoose.Schema({
    messages: [{
        name: String,
        date: Date,
        body: String,
        room: String
    }]
});
*/
const messageShema = new mongoose.Schema({
    message: [{
        name : {type: String, required: true},
        datum: {type: Date, "default": Date.now},
        body: {type: String, required: true},
        room: {type: String, required: true}
    }]
});

const chatLogsShema = new mongoose.Schema({
    messages: [messageShema]
});

mongoose.model('chatLogs', chatLogsShema, 'chatlogs');