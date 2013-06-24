var http = require('http');

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var responses = [];
var files = [];
app.get('/content/:filename', function(request, response) {
    if (files.indexOf(request.params.filename) === -1) {
        response.writeHead('404');
        response.end('Resource not found or has already downloaded once');
        return false;
    }
    response.writeHead(200);
    console.log('Requested file: ' + request.params.filename);
    responses[request.params.filename] = response;
});

app.get('/download/:filename.html', function(request, response) {
    if (files.indexOf(request.params.filename) === -1) {
        response.writeHead('404');
        response.end('Resource not found or has already downloaded once');
        return false;
    }
    response.setHeader('Content-Type', 'text/html');
    response.end('File ' +
            request.params.filename +
            ' is ready for download. <a href="/content/' +
            request.params.filename + '">Get it</a>');
});

var server = http.createServer(app);
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

bs.on('connection', function(client) {
    client.on('stream', function(stream, meta) {
        if (files.indexOf(meta.name) < 0) {
            files.push(meta.name);
        }
        if (responses[meta.name]) {
            delete files[files.indexOf(meta.name)];
            console.log('Transfer of file ' + meta.name + ' started');
            stream.pipe(responses[meta.name], {end: false});
            stream.on('end', function() {
                responses[meta.name].end();
                console.log('Transfer of file ' + meta.name + ' finished');
            });
            stream.on('data', function(data) {
                stream.write({rx: data.length / meta.size});
            });
        }
    });
});

server.listen(9000);
console.log('Server started on port 9000');
