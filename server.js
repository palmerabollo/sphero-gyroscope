'use strict'

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  console.log('a client connected');
});

var port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log('listening on *:%d', port);
  var robot = require('./robot').robot;

  robot.on('data', function(data) {
    var imu = {
      x: data.pitchAngle.value[0],
      y: data.rollAngle.value[0],
      z: data.yawAngle.value[0]
    };
    io.emit ('data', imu);
  });
});
