const mongoose = require('mongoose');
// TODO kličem pravi model?
const Profile = mongoose.model('Uporabnik');

const terminateProfile = (req, res) => {
    if(req.params.idUporabnika) {
        Profile.findByIdAndRemove(req.params.idUporabnika).exec((napaka) => {
            if (napaka) {
                return res.status(500).json(napaka);
            }
            res.status(204).json({"sporočilo" : "Ne najdem uporabnika!"});
        });
    } else {
        res.status(404).json({
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
    //console.log("-------------------------------------------------")
    //console.log(req.params.body);
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


        /*
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send('No files were uploaded.');
            return;
        }
        // nalaganje datoteke (slike)

        let pic = req.files.profile_picture
        let uploadPath = "./public/images/profilePics/" + pic.name;

        //profile.profile_picture = req.files.profile_picture;
        profile.mv(uploadPath, function(err) {
            if (err) {
                return res.status(500).send(err);
            }
            profile.profile_picture = pic.name;

            profile.save((napaka, profile) => {
                if(napaka) {
                    res.status(404).json(napaka);
                } else {
                    res.status(200).json(profile);
                }
            });
        });
        */
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