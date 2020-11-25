const mongoose = require('mongoose');

const chatLogsShema = new mongoose.Schema({
    messages: [{name: String, date: Date, body: String, room: String}]
});

mongoose.model('chatLogs', chatLogsShema, 'chatlogs');