const axios = require('axios');
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

    {href: '/',
    value: 'LOG OUT'},
]
const verification = (req, res) => {

    axios.get(apiParametri.streznik + '/api/uporabniki', {params : {username : req.body.username, password : req.body.password}}).then((odgovor) => {
        console.log("to je odgovor data: " + odgovor.data);
        if(odgovor.data.length == 0) {
            res.status(400).json({
                "sporocilo": "uporabnika nismo nasli."
            });
        } else {
            res.status(400).json({
                "sporočilo": "uporabnika nasli"
            });
        }
    })
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
      }).then(() => {
        res.status(400).json({
            "sporočilo": "uporabnika nasli"
        });
      });
    
}


/* GET home page */
const index = (req, res) => {
    if(cookieExists) {
        res.render('index', {
            title: 'TinyRoom',
            user: {
                username: req.body.username,
                id: 230
            },
            navigation : navigation,
            active_tab : 0,
            weatherData
        });
    } else {
        
        register(req, res);
    }
    
};

const private = (req, res) => {
    if(cookieExists) {
        res.render('private', { title: 'Private Room', user: {username: req.body.username, id: 230}, navigation : navigation, active_tab : 1});
    } else {
        register(req, res);
    }
    
}

const profile = (req, res) => {
    if(cookieExists) {
        res.render('profile', { 
                
                title: 'Profile', 
                navigation : navigation,
                active_tab : 2,
                user : {rank: 'admin', 
                        username: req.body.username, 
                        email: 'example@student.uni-lj.si', 
                        bio : 'To je moj bio',
                        id: 0}
                
        });
    } else {
        register(req, res);
    }


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
    registerin
};

