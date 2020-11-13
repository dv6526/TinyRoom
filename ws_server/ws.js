const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8070
});

// connection list
let sockets = [];

class UserSocket {
    constructor(socket) {
        this.username = undefined;
        this.socket = socket;
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
}

server.on('connection', function(socket) {
    // ko se nov connection naredi, ga dodamo v sockets list
    // prvo naredimo object
    var user = new UserSocket(socket)
    sockets.push(user);

    socket.on('message', function(msg) {
        var command = msg.substr(0, 2);
        var command_data = JSON.parse(msg.substring(3));

        if (!user.isIdentified()) {
            if (command = "ID") {
                // the user is trying to identify himself
                var success = user.identify(command_data.username, command_data.token);
                
                if (success) {
                    socket.send('You are logged in');
                }
                else {
                    socket.send('Unable to log you in!');
                }

            }
        }

        else {

        }
    });

    socket.on('close', function() {
        // ce se socket zapre ga odstranimo iz sockets lista
        sockets = sockets.filter(s => s !== socket);
    });
});