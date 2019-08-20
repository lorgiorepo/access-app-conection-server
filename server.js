var app = require('express')();
const uuidv1 = require('uuid/v1');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected:', socket.id);
  console.log('handshake:', socket.handshake)

  socket.on('getClientId', function(app, fn){
    console.log('App: ' + app);
    fn(uuidv1());
  });

  socket.on('disconnect', function(){
    console.log('user disconnected', socket.id);
  });
});

http.listen(80, function(){
  console.log('listening on *:80');
});