//var fs = require('fs');
var http = require('http');

// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var response = [];
app.get('/content/:filename', function(req, res) {
   res.writeHead(200);
//   res.setEncoding('binary');
console.log('File:' + req.params.filename);
response[req.params.filename] = res;
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
//      client.broadcast.emit('notfound');
      console.log(meta.name);
//      var response;
//        app.get('/' + meta.name, function(req, res) {
//            console.log('method ' + req.method);
//    stream.pause();
//        bs.get('/:fname', function(rec) {
//            console.log('connected!');
//            stream.resume();
//            rec.send(stream);
////            stream.pipe(rec, {end: false});
////            stream.on('end', function() {
////                res.end();
//                console.log('Transfer rec finished');
////            });
//            // Send progress back
//            stream.on('data', function(data) {
//                stream.write({rx: data.length / meta.size});
//            });
//        });
//        stream.pause();
//        var res = response[meta.name];
//        setTimeout(function() {
//            res = response[meta.name];
//            if (res) {
//                stream.resume();
//                console.log('Transfer started');
//
//                stream.pipe(res, {end: false});
//                stream.on('end', function() {
//                    res.end();
//                    console.log('Transfer finished');
//                });
//
//            }
//        }, 3000);
//        // Send progress back
//                stream.on('data', function(data) {
//                    stream.write({rx: data.length / meta.size});
//                });


        var res = response[meta.name];
//        stream.pause();
//        while (!res) {
//            var interval = setInterval(function() {
//                res = response[meta.name];
//                console.log('Retry...');
                if (res) {
//                    clearInterval(interval);
//                    stream.resume();
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
//            }, 5000);
            
//    console.log('waiting...');
//        }
//        if (res) {
//            stream.resume();
//            console.log('Transfer started');
//
//            stream.pipe(res, {end: false});
//            stream.on('end', function() {
//                res.end();
//                console.log('Transfer finished');
//            });
//            // Send progress back
//            stream.on('data', function(data) {
//                stream.write({rx: data.length / meta.size});
//            });
//        }
//        else {
//            stream.pause();
//        }
//        });
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

