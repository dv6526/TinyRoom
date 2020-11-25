const WebSocket = require('ws');
const wsserver = new WebSocket.Server({
    port: 8070
});

class UserSocket {
    constructor(socket) {
        this.username = undefined;
        this.socket = socket;

        // default position
        this.wanted_position = {x: 600, y: 600};
    }

    setPosition(position) {
        this.wanted_position = position;
    }

    getPosition() {
        return this.wanted_position;
    }

    getUsername() {
        return this.username;
    }

    isIdentified() {
        if (this.username == undefined) {
            return false;
        }
        return true;
    }

    identify(username, token) {
        // TO DO, check in database if cookie matches username
        // if it does, assign username
        this.username = username;
        return true;
        // this function returns true if the identification was correct
        // and false if it was not
    }

    getPublicInfo() {
        return {
            "username": this.getUsername(),
            "position": this.getPosition()
        }
    }
}

function dto_for_LI(user) {
    // build structure to send to a new user
    // tell him about all players in the room
    var dto = {"players": []};

    sockets.forEach(s => {
        if (s !== user) {
            dto.players.push(s.getPublicInfo());
        }
    })

    return dto;
}

// connection list
let sockets = [];

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
                var success = user.identify(command_data.username, command_data.token);
                
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
                    //socket.send('You are logged in');
                }
                else {
                    socket.send('Unable to log you in!');
                }

            }
        }

        else {
            if (command == "PO") {
                // player has supplied us with his position
                user.setPosition(command_data);
                //console.log(user);
                sockets.forEach(s => {
                    // dont send to itself
                    if (s !== user) {
                        s.socket.send("PO " + JSON.stringify(
                            {"position": user.getPublicInfo()}
                        ));
                    }
                });
            }

            if (command == "MS") {

                var msg = command_data.message;

                //console.log(msg);

                sockets.forEach(s => {
                    // dont send to itself
                    if (s !== user) {
                        s.socket.send("MS " + JSON.stringify({
                            "message": msg,
                            "username": user.getUsername()
                        }));
                    }
                });
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

module.exports = wsserver;