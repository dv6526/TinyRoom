const axios = require('axios');
const { NotExtended } = require('http-errors');
var apiParametri = {
  streznik: 'http://localhost:' + (process.env.PORT || 3000)
};

const cookieExists = false;


var weatherData = require('../models/weather.json')

var navigation = [
    {href: '/',
    value: 'CHAT'},

    {href: '/private',
    value: 'MY ROOM'},

    {href: '/profile',
    value: 'PROFILE'},

    {href: '/logout',
    value: 'LOG OUT'},
]
const verification = (req, res) => {
    console.log("longitude: " + req.body.longitude);
    console.log("latitude: " + req.body.latitude);
    var longit = req.body.longitude;
    var latit = req.body.latitude;

    axios.get(apiParametri.streznik + '/api/uporabniki', {params : {username : req.body.username, password : req.body.password}}).then((odgovor) => {
        if(odgovor.data.length == 0) {
            //res.render('register', { error: 'Wrong username or password' });
            res.render('register', {title: "Login or Register", navigation : navigation, active_tab : 3, user : {id: 230}, error: 'Wrong username or password'});
            //res.status(400).json({
            //    "sporocilo": "uporabnika nismo nasli."
            //});
        } else {
            req.session.user = req.body.username;
            req.session.user_id = odgovor.data[0]._id;
            //zakomentiraj naslednji dve vrstici, ce zelis apiWeatherCall()
            //req.session.weather = weatherData.weather;
            //res.redirect('/');
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
        console.log(response.data);
        formatWeatherData(response.data, req, res);
      }).catch(function (error) {
          console.error(error);
      }); 
    
}

function formatWeatherData(data, req, res) {
    var days= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    var weather7 = [];
    var day = {
        id: "day1",
        day: "MONDAY",
        type: "sun",
        type_string: "Sunny",
        temperature: "12 °C | 60 °F"
      };
    myArray = data.daily;

    myArray.forEach((val, index, array) => {
        var d = new Date(val.dt * 1000);
        var dayName = days[d.getDay()];
        day = {};
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
    console.log(req.body.username + " " + req.body.password + " " + req.body.email);
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
        res.redirect('/');
      }).catch((napaka) => {
        res.render('register', {title: "Login or Register", navigation : navigation, 
        active_tab : 3, error2: 'Username already exists!'});
      });

}

const logout = (req, res) => {
    req.session.destroy();
    register(req, res);
}


/* GET home page */
const index = (req, res) => {
    res.render('index', {
        title: 'TinyRoom',
        user: {
            username: req.session.user,
            id: req.session.user_id,
        },
        navigation : navigation,
        active_tab : 0,
        weather : req.session.weather
    });
};

const private = (req, res) => {

    res.render('private', { title: 'Private Room', user: {username: req.session.user, id: req.session.user_id}, navigation : navigation, active_tab : 1});

    
}

const profile = (req, res) => {
    //console.log("session user id " + req.session.user_id);
    axios.get(apiParametri.streznik+ '/api/uporabniki/'+ req.session.user_id).then((odgovor) => {
        //console.log(req.session.user_id);
        //console.log(odgovor.data);
        res.render('profile', { 
            
            title: 'Profile', 
            navigation : navigation,
            active_tab : 2,
            user : {rank: odgovor.data.rank, 
                    username: odgovor.data.username,
                    id: odgovor.data._id,
                    email: odgovor.data.email,
                    bio : odgovor.data.bio,
                    bio_title: odgovor.data.bio_title}
        });
    });
}

const profileUpdate = (req, res) => {
    //posodobi profil
    console.log("profileUpdate");
    console.log(req.body);
    // TODO save file

    if(req.body.pfp) {
        let koncnica = req.body.pfp.split(".")
        koncnica = koncnica[koncnica.length-1];
        axios({
            method: 'put',
            url: apiParametri.streznik + '/api/profile/' + req.session.user_id + '/info',
            data: {
                profile_picture: req.session.user + "." + koncnica
            }
        }).catch((napaka) => {
            res.status(404).json({
                "sporocilo": "uporabnika nismo nasli."
            });
        });
    }

    axios({
        method: 'put',
        url: apiParametri.streznik + '/api/profile/' + req.session.user_id + '/info',
        data: {
            bio_title: req.body.biotitle,
            bio: req.body.bio,
            chosen_skin: req.body.skin
        }
    }).then((odgovor) => {
        res.redirect('/profile');
    }).catch((napaka) => {
        res.status(404).json({
            "sporocilo": "uporabnika nismo nasli."
        });
    });
}

const profileChangePassword = (req, res) => {
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
    res.render('register', {title: "Login or Register", navigation : navigation, active_tab : 3, user : {id: 230}});
}

const novosporocilo = (req, res) => {
    res.send("poo poo");
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
    profileChangePassword
};

