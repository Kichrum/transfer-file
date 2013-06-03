var fs = require('fs');
var http = require('http');

// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var response;
app.get('/1.mp4', function(req, res) {
   res.writeHead(200);
//   res.setEncoding('binary');
console.log('File:');
response = res;
//console.log(file);
//   res.write(file, 'binary');
//   res.end();
});

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

// Wait for new user connections
bs.on('connection', function(client){
  // Incoming stream from browsers
  client.on('stream', function(stream, meta){
    //
//    var file = fs.createWriteStream(__dirname+ '/public/' + meta.name);
    stream.pipe(response, {end: false});
    stream.on('end', function() {
        response.end();
        console.log('Transfer finished');
    });
//response.write(stream);
//response.end(stream, 'binary');
    
    //
    // Send progress back
    stream.on('data', function(data){
      stream.write({rx: data.length / meta.size});
    });
//    response.end();
    //
  });
});
//
//

server.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000');

//
////var BinaryServer = require('binaryjs').BinaryServer;
//var fs = require('fs');
//
//// Start Binary.js server
//var server = BinaryServer({port: 9000});
//// Wait for new user connections
//server.on('connection', function(client){
//  // Stream a flower as a hello!
//  var file = fs.createReadStream(__dirname + '/flower.png');
//  client.send(file); 
//});

