var weatherData = require('../models/weather.json')

/* GET home page */
const index = (req, res) => {
    res.render('index', weatherData);
};

const private = (req, res) => {
    res.render('private', { title: 'Express'});
}

const profile = (req, res) => {
    res.render('profile', { 
            
            title: 'Express', 
            user : {rank: 'admin', 
                    username: 'domen', 
                    email: 'example@student.uni-lj.si', 
                    bio : 'To je moj bio'}
    });
}

const register = (req, res) => {
    res.render('register', { title: 'Express'});
}

module.exports = {
    index,
    private,
    profile,
    register
};
