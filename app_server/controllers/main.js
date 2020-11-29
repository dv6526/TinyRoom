const axios = require('axios');
const { NotExtended } = require('http-errors');
var apiParametri = {
  streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
const cookieExists = false;

var weatherData = require('../models/weather.json')
var n = require('../models/navigation.json')

const regPass = /^.{3,}$/;
const regEmail = /^\S+@\S+$/;
const regName = /^[a-zA-Z0-9]{1,10}$/;

const verification = (req, res) => {
    if(!regName.test(req.body.username)) {
        res.render('register', {title: "Login or Register", navigation : n.navigation,
            active_tab : 3, error2: 'Username does not fit the specification'});
        return;
    }
    if(!regPass.test(req.body.password)) {
        res.render('register', {title: "Login or Register", navigation : n.navigation,
            active_tab : 3, error2: 'Password does not fit the specification'});
        return;
    }

    console.log("longitude: " + req.body.longitude);
    console.log("latitude: " + req.body.latitude);
    var longit = req.body.longitude;
    var latit = req.body.latitude;

    axios.get(apiParametri.streznik + '/api/uporabniki', {params : {username : req.body.username, password : req.body.password}}).then((odgovor) => {
        if(odgovor.data.length == 0) {
            res.render('register', {title: "Login or Register", navigation : n.navigation, active_tab : 3, user : {id: 230}, error: 'Wrong username or password'});
        } else {

            req.session.user = req.body.username;
            req.session.user_id = odgovor.data[0]._id;

            var skins = {"bunny" : 0, "goat":1, "rat":2};
            req.session.sprite_idx = skins[odgovor.data[0].chosen_skin];
            //req.session.sprite_idx = odgovor.data[0].chosen_skin;
            //zakomentiraj naslednji dve vrstici, ce zelis apiWeatherCall()
            //req.session.weather = weatherData.weather;
            //res.redirect('/');
            if(longit === "" &&  latit === "") {
                req.body.longitude = 14.5058;
                req.body.latitude = 46.0569;
            }
            apiWeatherCall(req, res);
        }
    })
}

function apiWeatherCall(req, res) {
    var options = {
        method: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/onecall',
        params: {lat: req.body.latitude, lon: req.body.longitude, units: 'metric', lang: '-sl',exclude : 'current,minutely,hourly,alerts', appid: 'd62b2d57190388b445a9b96264ba0e44'
        //https://api.openweathermap.org/data/2.5/onecall?lat=14.12&lon=43&appid=d62b2d57190388b445a9b96264ba0e44
        }
      };
      
      axios.request(options).then(function (response) {
        formatWeatherData(response.data, req, res);
      }).catch(function (error) {
          console.error(error);
      }); 
    
}

function formatWeatherData(data, req, res) {
    var days= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    var weather7 = [];
    myArray = data.daily;

    myArray.forEach((val, index, array) => {
        var d = new Date(val.dt * 1000);
        var dayName = days[d.getDay()];
        var day = {};
        day.id = "day" + index+1;
        day.day =  dayName;
        day.icon = val.weather[0].icon;
        day.icon_string = val.weather[0].main;
        day.temperature = Math.round(val.temp.day) + ' °C';
        weather7.push(day);
    });
    req.session.weather = weather7;
    res.redirect('/');
    console.log(weather7.toString());
    
}

const validateCookie = (req, res, next) => {
    if(req.session.user) {
        console.log("id userja: " + req.session.user);
        next();
    } else {
        register(req, res);
    }
}

const registerin = (req, res) => {
    if(!regEmail.test(req.body.email)) {
        res.render('register', {title: "Login or Register", navigation : n.navigation,
            active_tab : 3, error2: 'Email address has a typo'});
        return;
    }
    if(!regName.test(req.body.username)) {
        res.render('register', {title: "Login or Register", navigation : n.navigation,
            active_tab : 3, error2: 'Username should consist only of letters or numbers'});
        return;
    }
    if(!regPass.test(req.body.password)) {
        res.render('register', {title: "Login or Register", navigation : n.navigation,
            active_tab : 3, error2: 'Password is too short'});
        return;
    }
    var longit = req.body.longitude;
    var latit = req.body.latitude;

    axios({
        method: 'post',
        url: apiParametri.streznik + '/api/uporabniki',
        data: {
            username: req.body.username,
            password:  req.body.password,
            email: req.body.email,
            rank : "admin"
        }
      }).then((odgovor) => {
        req.session.user = odgovor.data.username;
        req.session.user_id = odgovor.data._id;
        var skins = {"bunny" : 0, "goat":1, "rat":2};
        req.session.sprite_idx = skins[odgovor.data.chosen_skin];
        if(longit === "" &&  latit === "") {
            req.body.longitude = 14.5058;
            req.body.latitude = 46.0569;
        }
        apiWeatherCall(req, res);
      }).catch((napaka) => {
        res.render('register', {title: "Login or Register", navigation : n.navigation,
        active_tab : 3, error2: 'Username already exists!'});
      });

}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}


/* GET home page */
const index = (req, res) => {
    res.render('index', {
        title: 'TinyRoom',
        user: {
            username: req.session.user,
            id: req.session.user_id,
            sprite_idx : req.session.sprite_idx
        },
        navigation : n.navigation,
        active_tab : 0,
        weather : req.session.weather
    });
};

const private = (req, res) => {


    res.render('private', { title: 'Private Room', user: {username: req.session.user, id: req.session.user_id}, navigation : n.navigation, active_tab : 1});

}

const profile = (req, res) => {
    //console.log("session user id " + req.session.user_id);
    axios.get(apiParametri.streznik+ '/api/uporabniki/'+ req.session.user_id).then((odgovor) => {
        //console.log(req.session.user_id);
        //console.log(odgovor.data);
        res.render('profile', {
            title: 'Profile', 
            navigation : n.navigation,
            active_tab : 2,
            user : {rank: odgovor.data.rank, 
                    username: odgovor.data.username,
                    id: odgovor.data._id,
                    email: odgovor.data.email,
                    skin: odgovor.data.chosen_skin,
                    bio : odgovor.data.bio,
                    bio_title: odgovor.data.bio_title},
            error : ""
        });
    });
}

const profileUpdate = (req, res) => {
    //posodobi profil

    // preverjanje vnosov
    if(req.body.biotitle)
        req.body.biotitle = req.body.biotitle.substring(0,20);
    if(req.body.bio)
        req.body.bio = req.body.bio.substring(0,200);
    if(req.body.biotitle == "") {
        req.body.biotitle = "Default bio title";
    }
    if(req.body.bio == "") {
        req.body.bio = "This is default bio";
    }

    // TODO save file
    // ce ni slike poslji brez profile_picture podatka
    try {
        let koncnica = "";
        koncnica = req.files.pfp.name.split(".")
        koncnica = koncnica[koncnica.length-1];
        // shrani samo ce je jpg, png ali gif
        if(koncnica == "jpg" || koncnica == "png" || koncnica == "gif") {
            // file save
            let profilePic = req.files.pfp;
            profilePic.mv('./public/profileImages/' + req.session.user + "." + koncnica);

            // send info to api
            axios({
                method: 'put',
                url: apiParametri.streznik + '/api/profile/' + req.session.user_id + '/info',
                data: {
                    bio_title: req.body.biotitle,
                    bio: req.body.bio,
                    chosen_skin: req.body.skin,
                    profile_picture: koncnica
                }
            }).then((odgovor) => {
                var skins = {"bunny" : 0, "goat":1, "rat":2};
                req.session.sprite_idx = skins[req.body.skin];
                res.redirect('/profile');
            }).catch((napaka) => {
                res.status(404).json({
                    "sporocilo": "uporabnika nismo nasli."
                });
            });
        } else {
            res.status(415).json({
                "sporocilo": "Vrsta datoteke ni podprta."
            });
        }
    } catch {
        axios({
            method: 'put',
            url: apiParametri.streznik + '/api/profile/' + req.session.user_id + '/info',
            data: {
                bio_title: req.body.biotitle,
                bio: req.body.bio,
                chosen_skin: req.body.skin
            }
        }).then((odgovor) => {
            var skins = {"bunny": 0, "goat": 1, "rat": 2};
            req.session.sprite_idx = skins[req.body.skin];
            res.redirect('/profile');
        }).catch((napaka) => {
            res.status(404).json({
                "sporocilo": "uporabnika nismo nasli."
            });
        });
    }
}

const profileChangePassword = (req, res) => {
    // preverba dolzine passworda

    if(!regPass.test(req.body.password)) {
        axios.get(apiParametri.streznik+ '/api/uporabniki/'+ req.session.user_id).then((odgovor) => {
            res.render('profile', {
                title: 'Profile',
                navigation : n.navigation,
                active_tab : 2,
                user : {rank: odgovor.data.rank,
                    username: odgovor.data.username,
                    id: odgovor.data._id,
                    email: odgovor.data.email,
                    skin: odgovor.data.chosen_skin,
                    bio : odgovor.data.bio,
                    bio_title: odgovor.data.bio_title},
                error : 'Password is too short'
            });
        });
        return;
    }

    //api klic
    axios({
          method: 'put',
          url: apiParametri.streznik + '/api/profile/' + req.session.user_id + '/password',
          data: {
              password: req.body.password,
          }
    }).then((odgovor) => {
      res.redirect('/profile');
    }).catch((napaka) => {
        res.status(404).json({
            "sporocilo": "uporabnika nismo nasli."
        });
    });
}

const profileTerminate = (req, res) => {
    console.log("profileTerminate" + req.session.user_id);
    //api klic
    axios({
        method: 'delete',
        url: apiParametri.streznik + '/api/profile/' + req.session.user_id
    }).then((odgovor) => {
        // TODO ostane vpisan - briši piškotke al neki
        req.session.user = undefined;
        res.redirect('/');
    }).catch((napaka) => {
        res.status(404).json({
            "sporocilo": "uporabnika nismo nasli."
        });
    });


}

const register = (req, res) => {
    res.render('register', {title: "Login or Register", navigation : n.navigation, active_tab : 3, user : {id: 230}});
}

const novosporocilo = (req, res) => {
    res.send("poo poo");
}

const db = (req, res) => {
    res.render('db', {title: "Database handling", navigation : n.navigation, active_tab : 3, user : {id: 230}});
}

const dbDeleteAll = (req, res) => {

}

const dbAddEntries = (req, res) => {

}

module.exports = {
    index,
    private,
    profile,
    register,
    novosporocilo,
    verification,
    registerin,
    validateCookie,
    logout,
    profileUpdate,
    profileTerminate,
    profileChangePassword,
    db,
    dbDeleteAll,
    dbAddEntries
};

