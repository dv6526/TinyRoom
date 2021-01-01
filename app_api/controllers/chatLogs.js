const mongoose = require('mongoose');
const ChatLogs = mongoose.model('chatLogs');
const Messages = mongoose.model('messages');
const Profile = mongoose.model('Uporabnik');

const sendChatLog = (req, res) => {
    ChatLogs.findOne({}).exec((napaka, log) => {
        try {
            log.messages.push(req.body);
            log.save((error, savedLog) => {
                if(error) {
                    return res.status(400).json(error);
                } else {
                    sendMessage(req, res);
                }
            });
        } catch (error) {
            ChatLogs.create({});
            console.log("Ponovna inicializacija chat logov!");
            console.log(error);
            res.status(400).json({"message": "Napaka pri shranjevanju sporocila!"});
        }
    });
}

const getChatLogs = (req, res) => {
    ChatLogs.find({}).exec((error, chatlogs) => {
        if(error) {
            return res.status(400).json(error);
        } else {
            res.status(201).json(chatlogs);
        }
    });
}

const sendMessage = (req, res) => {
    Messages.create(req.body, (error, message) => {
        if (error) {
            console.log('napaka pri dodajanju sporocila', error);
            return res.status(400).json(error);
        } else {
            res.status(201).json(req.body);
        }
    });
}

const getMessages = (req, res) => {
    /* return ALL
    Messages.find({}).exec((error, queriedMessages) => {
        if(error) {
            return res.status(500).json(error);
        } else if(!queriedMessages) {
            return res.status(404).json({ "sporocilo": "Ne najdem sporocil z navedenim datumom!" });
        } else {
            res.status(200).json(queriedMessages);
        }
    });
    */
    //const zacetniDatum = new Date("2020-12-28");      // req.query.startDate => 2020-12-27T14:30:55.271Z
    //const koncniDatum = new Date("2020-12-29");

    // filter
    let startDate = new Date(req.query.date);
    startDate.setHours(startDate.getHours()-1);      // lokalizacija ne štima
    let endDate = new Date(req.query.date);
    endDate.setDate(endDate.getDate()+1);
    endDate.setHours(endDate.getHours()-1);
    let page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const pagesToSkip = Math.max(0, page * perPage);
    const query = {
        date: {
            $gte: startDate,
            $lt:  endDate
        }
    }
    Messages.find(query).limit(perPage).skip(pagesToSkip).exec((error, queriedMessages) => {
        if(error) {
            console.log("Prišlo je do napake pri pridobivanju sporočil!");
            return res.status(500).json(error);
        } else if(!queriedMessages) {
            console.log("Ne najdem sporocil z navedenim datumom!");
            return res.status(404).json({ "sporocilo": "Ne najdem sporocil z navedenim datumom!" });
        } else {
            console.log("Sporočila so bila najdena in poslana!");
            res.status(200).json(queriedMessages);
        }
    });

}

module.exports = {sendChatLog, getChatLogs, sendMessage, getMessages};
