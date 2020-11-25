const axios = require('axios');
const { NotExtended } = require('http-errors');
var apiParametri = {
  streznik: 'http://localhost:' + (process.env.PORT || 8000)
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

    axios.get(apiParametri.streznik + '/api/uporabniki', {params : {username : req.body.username, password : req.body.password}}).then((odgovor) => {
        if(odgovor.data.length == 0) {
            res.status(400).json({
                "sporocilo": "uporabnika nismo nasli."
            });
        } else {
            req.session.user = req.body.username;
            req.session.user_id = odgovor.data[0]._id;
            res.redirect('/');
        }
    })
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
        res.status(400).json(odgovor.data);
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
            id: 230
        },
        navigation : navigation,
        active_tab : 0,
        weatherData
    });
    
    
};

const private = (req, res) => {

    res.render('private', { title: 'Private Room', user: {username: req.session.user, id: 230}, navigation : navigation, active_tab : 1});

    
}

const profile = (req, res) => {
    console.log("session user id " + req.session.user_id);
    axios.get(apiParametri.streznik+ '/api/uporabniki/'+ req.session.user_id).then((odgovor) => {
        console.log(odgovor.data);
        res.render('profile', { 
            
            title: 'Profile', 
            navigation : navigation,
            active_tab : 2,
            user : {rank: odgovor.data.rank, 
                    username: odgovor.data.username, 
                    email: odgovor.data.email,
                    bio : odgovor.data.bio}
            
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
    logout
};

