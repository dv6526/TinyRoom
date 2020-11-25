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
            id: req.session.user_id,
        },
        navigation : navigation,
        active_tab : 0,
        weatherData
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
    axios({
        method: 'put',
        url: apiParametri.streznik + '/api/profile/' + req.session.user_id + '/info',
        data: {
            bio_title: req.body.biotitle,
            bio: req.body.bio,
            chosen_skin: req.body.skin
        }
    }).catch((napaka) => {
        res.status(404).json({
            "sporocilo": "uporabnika nismo nasli."
        });
    });

    if(req.body.pfp) {
        let koncnica = req.body.pfp.split(".")
        koncnica = koncnica[koncnica.length-1];
        axios({
            method: 'put',
            url: apiParametri.streznik + '/api/profile/' + req.session.user_id + '/info',
            data: {
                profile_picture: req.session.user + "." + koncnica
            }
        }).then((odgovor) => {
            res.redirect('/profile');
        }).catch((napaka) => {
            res.status(404).json({
                "sporocilo": "uporabnika nismo nasli."
            });
        });
    }
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

