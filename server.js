var app = require('express')();
const uuidv1 = require('uuid/v1');
var memjs = require('memjs');

var http = require('http').createServer(app);
var io = require('socket.io')(http);
var memcached = memjs.Client.create(process.env.MEMCACHEDCLOUD_SERVERS, {
  username: process.env.MEMCACHEDCLOUD_USERNAME,
  password: process.env.MEMCACHEDCLOUD_PASSWORD
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.origins((origin, callback) => {
    console.log('Validate Origin: ' + origin );
    if (origin !== 'https://access-app-conection-front.herokuapp.com') {
        console.log('Origin: ' + origin + ' not allowed');
      return callback('origin not allowed', false);
    }
    callback(null, true);
});

io.on('connection', function(socket){
  console.log('a user connected:', socket.id);
  console.log('handshake:', socket.handshake)

  socket.on('getClientId', function(app, fn){
    console.log('App: ' + app);
    
    var clientId = uuidv1();
    memcached.set(app, clientId);
    fn(clientId);
  });

  socket.on('disconnect', function(){
    memcached.get("mybookings", function (err, value, key) {
      if (value != null) {
        console.log(value.toString()); // Will print clientId
      }
    });
    console.log('user disconnected', socket.id);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});