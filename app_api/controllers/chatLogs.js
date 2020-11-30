const mongoose = require('mongoose');
const chatLogs = mongoose.model('chatLogs');

const sendChatLog = (req, res) => {
    chatLogs.findOne({}).exec((napaka, log) => {
        try {
            log.messages.push(req.body);
            log.save(req.body);
        } catch (error) {
            console.log(error);
        }

    });
}

module.exports = {sendChatLog};