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



/* GET home page */
const index = (req, res) => {
    res.render('index', {
        title: 'Express',
        user: {
            username: 'Test',
            id: 230
        },
        navigation : navigation,
        active_tab : 0,
        weatherData
    });
};

const private = (req, res) => {
    res.render('private', { title: 'Express', navigation : navigation, active_tab : 1});
}

const profile = (req, res) => {

    res.render('profile', { 
            
            title: 'Express', 
            navigation : navigation,
            active_tab : 2,
            user : {rank: 'admin', 
                    username: 'domen', 
                    email: 'example@student.uni-lj.si', 
                    bio : 'To je moj bio'}
            
    });

}

const register = (req, res) => {
    
    res.render('register', { navigation : navigation, active_tab : 3});
}

const novosporocilo = (req, res) => {
    res.send("poo poo");
}

module.exports = {
    index,
    private,
    profile,
    register,
    novosporocilo
};
