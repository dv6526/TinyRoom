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
        profile.password = req.body.password;
        console.log(profile.password);
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
        // set user info
        if(req.body.bio_title)
            profile.bio_title = req.body.bio_title;
        if(req.body.bio)
            profile.bio = req.body.bio;
        if(req.body.chosen_skin)
            profile.chosen_skin = req.body.chosen_skin;

        // FILE SAVING
        if(req.files) {
            let koncnica = req.files.pfp.name.split(".");
            koncnica = koncnica[koncnica.length-1];
            // shrani samo ce je jpg, png ali gif
            if(koncnica == "jpg" || koncnica == "png" || koncnica == "gif") {
                // file save
                let profilePic = req.files.pfp;
                profilePic.mv('./public/profileImages/' + profile.username + "." + koncnica).then((value, error) => {
                    if(error) {
                        console.log("Nekaj je šlo narobe s premikanje profilne slike v strežnikov pomnilnik!");
                    } else {
                        profile.profile_picture = koncnica;
                        profile.save((napaka, profile) => {
                            if(napaka) {
                                console.log("Nekaj je šlo narobe pri shranjevanju posodobitev uporabnika s priloženo profilno sliko!");
                                res.status(404).json(napaka);
                            } else {
                                console.log("Uporabnikovi podatki so bili uspešno posodobljeni, vključno s profilno sliko!");
                                res.status(200).json(profile);
                            }
                        });
                    }
                });
            } else {
                console.log("Vrsta datoteke ni podprta.");
                profile.save((napaka, profile) => {
                    if(napaka) {
                        console.log("Nekaj je šlo narobe pri shranjevanju posodobitev uporabnika brez priložene profilne slike!");
                        res.status(404).json(napaka);
                    } else {
                        console.log("Uporabnikovi podatki so bili uspešno posodobljeni, brez profilne slike!");
                        res.status(200).json(profile);
                    }
                });
            }
        }
    });
}

module.exports = {terminateProfile, changePassword, changeProfileInfo};
