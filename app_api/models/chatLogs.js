const mongoose = require('mongoose');

const messageShema = new mongoose.Schema({
        name : {type: String, required: true},
        datum: {type: Date, "default": Date.now},
        body: {type: String, required: true},
        room: {type: String, required: true}
});

const chatLogsShema = new mongoose.Schema({
    messages: [messageShema]
});

mongoose.model('chatLogs', chatLogsShema, 'chatlogs');