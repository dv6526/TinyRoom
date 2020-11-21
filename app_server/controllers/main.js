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
            req.session.user = req.body.username;
            res.status(400).json(odgovor.data);
        }
    })
}

const validateCookie = (req, res, next) => {
    if(req.session.user) {
        console.log(req.session.user);
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
        res.status(400).json(odgovor.data);
      });

}


/* GET home page */
const index = (req, res) => {
    
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
    
    
};

const private = (req, res) => {

    res.render('private', { title: 'Private Room', user: {username: req.body.username, id: 230}, navigation : navigation, active_tab : 1});

    
}

const profile = (req, res) => {

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
    validateCookie
};

