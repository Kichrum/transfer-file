var app = require('express')(),
        server = require('http').createServer(app),
        io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

var files = [];
//var reader = new FileReader();

io.sockets.on('connection', function(socket) {
    socket.on('new_user', function(hash) {
        socket.broadcast.emit('new_user', hash);
    });
    socket.on('new_file', function(data) {
        files[data] = socket;
        console.log(files);
    });
    
    socket.on('send_file', function(data) {
//        data.pipe(socket);
//        socket.sendfile(data);
//        var fs = require('fs');
//        fs.readFile(data, function(err, content) {
            console.log('File:');
//           console.log(data); 
           
//        });
        socket.broadcast.emit('get_file', data);
    });
//    socket.on('my other event', function(data) {
//        console.log(data);
//    });
});