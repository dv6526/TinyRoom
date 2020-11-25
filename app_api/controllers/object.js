const mongoose = require('mongoose');
const Obj = mongoose.model('privateRoom');

const vrniObjectById = (req, res) => {
    Obj.findById(req.params.idObjekta).exec((napaka, object) => {
        if(!object) {
            res.status(404).json({"sporočilo" : "Ne najdem objekta z idjem!"})
        } else if(napaka) {
            res.status(500).json(napaka);
        }
        res.status(200).json(object);
    });
};

/*const vrniLokacijo = (req, res) => {
    kako dobit lokacijo pikslov
};*/

module.exports = {vrniObjectById}; //vrniLokacijo