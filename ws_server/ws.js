const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8070
});

// connection list
let sockets = [];

server.on('connection', function(socket) {
    // ko se nov connection naredi, ga doddamo v sockets list
    sockets.push(socket);

    socket.on('message', function(msg) {
        console.log(msg);
    });

    socket.on('close', function() {
        // ce se socket zapre ga odstranimo iz sockets lista
        sockets = sockets.filter(s => s !== socket);
    });
});