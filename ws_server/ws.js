const WebSocket = require('ws');
const axios = require('axios');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
  };


// connection list
let sockets = [];

function start_ws() {
    const wsserver = new WebSocket.Server({
        port: 8070
    });
    
    wsserver.on('connection', function(socket) {
        // ko se nov connection naredi, ga dodamo v sockets list
        // prvo naredimo object
        var user = new UserSocket(socket)
        sockets.push(user);
    
        socket.on('message', function(msg) {
            // for debugging! This stuff bloats your logging
            //console.log(msg);
    
            var command = msg.substr(0, 2);
    
            try {
                var command_data = JSON.parse(msg.substring(3));
            } catch (err) {
                console.log(`Decoding command data was not possible for "${msg}"`);
                // abandon processing the message
                return;
            }
    
            if (!user.isIdentified()) {
                if (command == "ID") {
                    // the user is trying to identify himself
                    user.identify(command_data.username, command_data.token, command_data.weather, function (success) {
                        if (success) {
                            console.log(user.username, "has identified himself");
        
                            // Notify everyone of new player!
                            var join_info = JSON.stringify(
                                {"player": user.getPublicInfo()}
                            );
                            sockets.forEach(s => {
                                // dont send to itself
                                if (s !== user) {
                                    s.socket.send("JO " + join_info);
                                }
                            });
        
                            // Now notify the new user of all the other players
                            user.socket.send("LI " + JSON.stringify(dto_for_LI(user)));
                            sockets.forEach(s => {
                                if (s.g_muted) {
                                    user.socket.send("GM " + JSON.stringify({"username": s.getUsername()}));
                                }
                            });
                            //socket.send('You are logged in');
                        }
                        else {
                            socket.send('Unable to log you in!');
                        }
                    });
                    
                    
    
                }
            }
    
            else {
                if (command == "PO") {
                    // player has supplied us with his position
                    user.setPosition(command_data);
                    //console.log(user);
                    sockets.forEach(s => {
                        // dont send to itself
                        if (s !== user && s.getRoom() == user.getRoom()) {
                            s.socket.send("PO " + JSON.stringify(
                                {"position": user.getPublicInfo()}
                            ));
                        }
                    });
                }
    
                else if (command == "MS") {
                    
                    var msg = command_data.message;
                    if(msg.length > 0 && !user.g_muted) {
                        console.log(user.getUsername(), msg, user.getRoom());
                        
			try {sendChatLog(user.getUsername(), msg, user.getRoom());}
			catch(napaka) {console.log("sendChatLog napaka");}
        
                        sockets.forEach(s => {
                            // dont send to itself
                            //we are sending from user to s
                            //we dont send if s muted user
                            if (s !== user && s.getRoom() == user.getRoom() && !s.mute.includes(user.getUsername())) {
                                s.socket.send("MS " + JSON.stringify({
                                    "message": msg,
                                    "username": user.getUsername()
                                }));
                            }
                        });
                    }
                    
                }
    
                else if (command == "AL") {
                    user.friends.push(command_data.username);
                }
    
                else if (command == "JO") {
                    if (command_data.username == undefined) {
                        user.joinRoom(undefined);
                    }
                    else if (user.getUsername() == command_data.username || findByUsername(command_data.username).friends.includes(user.getUsername())) {
                        user.joinRoom(command_data.username);
                    }
                    else {
                        console.log(user.getUsername(), "does not have permission for", command_data.username);
                    }
                }

                else if (command == "ER") {
                    if (command_data.username == undefined) {
                        user.joinRoom(undefined);
                    }
                    else {
                        user.joinRoom(command_data.username);
                    }
                }
            
                else if (command == "MU") {
                    user.mute.push(command_data.username);
                }
    
                else if (command == "UN") {
                    user.mute = user.mute.filter(u => u !== command_data.username);
                }
    
                else if (command == "GM") {
                    findByUsername(command_data.username).g_muted = true;
                    sockets.forEach(s => {
                        // dont send to itself
                        if (s !== user) {
                            s.socket.send("GM " + JSON.stringify(
                                {"username": command_data.username}
                            ));
                        }
                    });
                }
    
                else if (command == "GU") {
                    findByUsername(command_data.username).g_muted = false;
                    sockets.forEach(s => {
                        // dont send to itself
                        if (s !== user) {
                            s.socket.send("GU " + JSON.stringify(
                                {"username": command_data.username}
                            ));
                        }
                    });
                }

                else if (command == "WA") {
                    findByUsername(command_data.username).socket.send("WA " + JSON.stringify({"username": user.getUsername()}));
                }

                else if (command == "PM") {
                    findByUsername(command_data.recipient).socket.send("PM " + JSON.stringify({
                        "username": user.getUsername(),
                        "message": command_data.message
                    }));
                }

                else if (command == "KI") {
                    var kicked_user = findByUsername(command_data.username);
                    kicked_user.socket.send("KI " + JSON.stringify({"username": user.getUsername()}));
                    kicked_user.socket.close();
                }
            }
        });
    
        socket.on('close', function() {
            // ce se socket zapre ga odstranimo iz sockets lista
            console.log(user.getUsername(), "left");
            sockets.forEach(s => {
                // dont send to itself
                if (s !== user) {
                    s.socket.send("LE " + JSON.stringify({"username": user.getUsername()}));
                }
            });
            sockets = sockets.filter(s => s !== user);
        });
    });
}

start_ws();

function dto_for_LI(user) {
    // build structure to send to a new user
    // tell him about all players in the room
    var dto = {
        "room": user.getRoom(),
        "players": []
    };

    sockets.forEach(s => {
        if (s !== user && s.getRoom() == user.getRoom()) {
            dto.players.push(s.getPublicInfo());
        }
    })

    return dto;
}

function findByUsername(username) {
    for (let i = 0; i < sockets.length; i++) {
        const user = sockets[i];
        if (user.getUsername() == username) {
            return user;
        }
    }
}

function sendChatLog(name, msg, room) {
    var d = new Date();
    var date = d.getTime();
    if(room == undefined) {
        room = "global";
    }
    axios({
        method: 'post',
        url: apiParametri.streznik + '/api/chatlogs',
        data: {
            name: name,
            date:  d,
            body: msg,
            room : room
        }
      }).catch((napaka) => {
        console.log("Sporočilo se ni uspešno poslalo na bazo!");
      });
}

class UserSocket {
    constructor(socket) {
        this.username = undefined;
        this.sprite_idx = undefined;
        this.weather = undefined;
        this.friends = [];
        this.mute = [];
        this.g_muted = false;
        this.room = undefined;
        this.socket = socket;

        // default position
        this.wanted_position = {x: 600, y: 600};
    }

    setPosition(position) {
        this.wanted_position = position;
    }

    getRoom() {
        return this.room;
    }

    joinRoom(room) {
        // ta metoda se poklice ko se user joina nekemu roomu
        // room variable je username od ownerja sobe, oziroma identifikator sobe

        // prvo obvestimo vse userje stare sobe da gremo stran
        sockets.forEach(s => {
            // dont send to itself
            if (s !== this && s.getRoom() == this.getRoom()) {
                s.socket.send("LE " + JSON.stringify({"username": this.getUsername()}));
            }
        });

        // gremo v drugo sobo
        this.room = room;

        // obvestimo vse userje nove sobe da smo prisli not
        sockets.forEach(s => {
            // dont send to itself
            if (s !== this && s.getRoom() == this.getRoom()) {
                s.socket.send("JO " + JSON.stringify(
                    {"player": this.getPublicInfo()}
                ));
            }
        });

        // posljemo userju ki je prisu na novo v sobo informacije o vseh userjih v sobi
        this.socket.send("LI " + JSON.stringify(dto_for_LI(this)));
    }

    getPosition() {
        return this.wanted_position;
    }

    getUsername() {
        return this.username;
    }

    getWeather() {
        return this.weather;
    }

    getSkin() {
        return this.sprite_idx;
    }

    isIdentified() {
        if (this.username == undefined) {
            return false;
        }
        return true;
    }

    identify(username, token, weather, callback) {
        // TO DO, check in database if cookie matches username
        // if it does, assign username
        this.username = username;
        this.weather = weather;
        var chosenSkin;
        var user = this;
        //api call
        axios.get(apiParametri.streznik + "/api/uporabniki/" + username + "/profile").then((odgovor) => {
            if(odgovor.length == 0) {
                callback(false);
            } else {
                var skins = {"bunny" : 0, "goat":1, "rat":2};
                //console.log(odgovor.data.chosen_skin);
                user.sprite_idx = skins[odgovor.data.chosen_skin];
                callback(true);
            }
        })


        // this function returns true if the identification was correct
        // and false if it was not
    }

    getPublicInfo() {
        return {
            "username": this.getUsername(),
            "position": this.getPosition(),
            "skin": this.getSkin(),
            "weather": this.getWeather()
        }
    }
}



module.exports = start_ws;
