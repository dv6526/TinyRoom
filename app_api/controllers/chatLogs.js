const mongoose = require('mongoose');
const chatLogs = mongoose.model('chatLogs');

const sendChatLog = (req, res) => {
    chatLogs.findOne({}).exec((napaka, log) => {
        try {
            log.messages.push(req.body);
            log.save(req.body);
        } catch (error) {
            chatLogs.create({});
            console.log("Ponovna inicializacija chat logov!");
            console.log(error);
        }

    });
}

const getChatLogs = (req, res) => {
    // get query parameters  api/chatLogs/datum?limit=x
}

module.exports = {sendChatLog, getChatLogs};
