const mongoose = require('mongoose');
// TODO kličem pravi model?
const Profile = mongoose.model('Uporabnik');
const Soba = mongoose.model('privateRoom');

const terminateProfile = (req, res) => {
    if(req.params.idUporabnika) {
        Profile.findByIdAndRemove(req.params.idUporabnika).exec((napaka, profil) => {
            if (napaka) {
                return res.status(500).json(napaka);
            } else {
                Soba.remove({owner: profil.username}).exec((napaka, soba) => {
                    if (napaka) {
                        return res.status(500).json(napaka);
                    }
                    console.log("Soba uporabnika je bila uspešno izbrisana");
                });
            }
            return res.status(200).json({"sporočilo" : "Ne najdem uporabnika!"});
        });
    } else {
        return res.status(404).json({
            "sporočilo": "Ne najdem uporabnika, idUporabnika je obvezen parameter."
        });
    }
}

const changePassword = (req, res) => {
    console.log("0" + "     " + req.params.idUporabnika);
    //če obstaja uporabnik mu spremeni geslo
    Profile.findById(req.params.idUporabnika).exec((napaka, profile) => {
        if(!profile) {
            res.status(404).json({"sporočilo" : "Ne najdem uporabnika!"});
        } else if(napaka) {
            res.status(500).json(napaka);
        }
        console.log(profile);
        profile.nastaviGeslo(req.body.password);
        console.log(profile.password);
        profile.save((napaka, profile) => {
           if(napaka) {
               res.status(404).json(napaka);
           } else {
            res.status(200).json({ "zeton": profile.generirajJwt() });
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

        if(req.body.bio_title)
            profile.bio_title = req.body.bio_title;
        if(req.body.bio)
            profile.bio = req.body.bio;
        if(req.body.chosen_skin)
            profile.chosen_skin = req.body.chosen_skin;
        if(req.body.profile_picture)
            profile.profile_picture = req.body.profile_picture;

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