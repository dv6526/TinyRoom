const mongoose = require('mongoose');
// TODO kličem pravi model?
const Profile = mongoose.model('Uporabnik');

const terminateProfile = (req, res) => {
    const {idUporabnika} = req.params;
    if(idUporabnika) {
        Profile.findByIdAndRemove(idLokacije).exec((napaka) => {
            if (napaka) {
                return res.status(500).json(napaka);
            }
            res.status(204).json(null);
            });
    } else {
        res.status(404).json({
            "sporočilo": "Ne najdem uporabnika, idUporabnika je obvezen parameter."
        });
    }
}

const changePassword = (req, res) => {
    //če obstaja uporabnik mu spremeni geslo
    Profile.findById(req.params.idUporabnika).exec((napaka, profile) => {
        if(!profile) {
            res.status(404).json({"sporočilo" : "Ne najdem uporabnika!"});
        } else if(napaka) {
            res.status(500).json(napaka);
        }

        profile.password = req.body.password;

        profile.save((napaka, profile) => {
           if(napaka) {
               res.status(404).json(napaka);
           } else {
               res.status(200).json(profile);
           }
        });
    });
}

const changeProfileInfo = (req, res) => {
    //če obstaja uporabnik mu spremeni profilne informacije
    Profile.findById(req.params.idUporabnika).exec((napaka, profile) => {
        if(!profile) {
            res.status(404).json({"sporočilo" : "Ne najdem uporabnika!"});
        } else if(napaka) {
            res.status(500).json(napaka);
        }

        //profile.username = req.body.username;
        //profile.rank = req.body.rank;
        profile.email = req.body.email;
        //profile.biotitle = req.body.biotitle;
        profile.bio = req.body.bio;
        profile.pic = req.body.pic;
        //profile.chosen_skin = req.body.chosen_skin;

        profile.save((napaka, profile) => {
            if(napaka) {
                res.status(404).json(napaka);
            } else {
                res.status(200).json(profile);
            }
        });
    });
}

module.exports = {terminateProfile, changePassword, changeProfileInfo};