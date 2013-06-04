var http = require('http');

// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var response = [];
app.get('/content/:filename', function(req, res) {
    res.writeHead(200);
    console.log('File:' + req.params.filename);
    response[req.params.filename] = res;
});

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

// Wait for new user connections
bs.on('connection', function(client) {
    // Incoming stream from browsers
    client.on('stream', function(stream, meta) {
        console.log(meta.name);

        var res = response[meta.name];
        if (res) {
            console.log('Transfer started');

            stream.pipe(res, {end: false});
            stream.on('end', function() {
                res.end();
                console.log('Transfer finished');
            });
            // Send progress back
            stream.on('data', function(data) {
                stream.write({rx: data.length / meta.size});
            });
        }

    });
});

server.listen(9000);
console.log('Server started on port 9000');
