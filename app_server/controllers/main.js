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
    const internal_routes = {
        "/": index,
        "/private": private,
        "/profile": profile,
        "/register": index
    };

    // Username: Password
    const accounts = {
        "Aphrodite": "fdv92h",
        "Apollo":    "ocb8ad",
        "Ares":      "3g3uvq",
        "Hades":     "gbv695",
        "Hermes":    "3yhrg8",
        "Poseidon":  "80wrsd"
    }

    var username = req.body.username;
    var password = req.body.password;
    
    if (username in accounts) {
        
        if (accounts[username] == password) {
            internal_routes[req.path](req, res);
        }
        
        else {
            console.log(`User tried logging into ${username} but provided ${password} instead of ${accounts[username]}`)
            res.send("Error: The password you entered is not correct.");
        }
    }

    else {
        res.send(`Error: The account ${username} does not exist.`);
    }

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
    res.render('register', {title: "Login or Register", navigation : navigation, active_tab : 3, destination : req.path});
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
    verification
};
