var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io').listen(server);

app.configure(function() {
  app.use(express['static']('' + __dirname + '/public'));
  return app.set('port', process.env.PORT || 3000);
});

io.sockets.on('connection', function (socket) {

  socket.on('orientation', function (data) {
    socket.broadcast.emit('orient', data);
  });

});

server.listen(app.get('port'), function() {
  return console.log('Listening on port ' + (app.get('port')));
});
