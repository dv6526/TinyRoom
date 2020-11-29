const mongoose = require('mongoose');
const chatLogs = mongoose.model('chatLogs');

const sendChatLog = (req, res) => {
    chatLogs.findOne({}).exec((napaka, log) => {
        log.messages.push(req.body);
        log.save(req.body);
    });
}

module.exports = {sendChatLog};