const mongoose = require('mongoose');

const messageShema = new mongoose.Schema({
        name : {type: String, required: true},
        date: {type: Date, "default": Date.now},
        body: {type: String, required: true},
        room: {type: String, required: true}
});

const chatLogsShema = new mongoose.Schema({
    messages: [messageShema]
});

mongoose.model('messages', messageShema, 'messages');
mongoose.model('chatLogs', chatLogsShema, 'chatlogs');
