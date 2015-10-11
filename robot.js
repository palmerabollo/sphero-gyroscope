'use strict';

var Cylon = require('cylon');

var robot = Cylon.robot({
  connections: {
    sphero: {
      adaptor: 'sphero',
      port: process.env.SPHERO_PORT || '/dev/tty.Sphero-BGO-AMP-SPP'
    }
  },

  devices: {
    sphero: {
      driver: 'sphero'
    }
  },

  events: ['data'],

  work: function(me) {
    var opts = {
      // n: int, divisor of the max sampling rate, 400 hz/s
      // n = 40 means 400/40 = 10 data samples per second,
      // n = 200 means 400/200 = 2 data samples per second
      n: 20,
      // m: int, number of data packets buffered before passing them to the stream
      // m = 10 means each time you get data it will contain 10 data packets
      // m = 1 is usually best for real time data readings.
      m: 1,
      // pcnt: 1 -255, how many packets to send.
      // pcnt = 0 means unlimited data Streaming
      // pcnt = 10 means stop after 10 data packets
      pcnt: 0,
      // 'motorsPWM', 'imu', 'accelerometer', 'gyroscope', 'motorsIMF',
      // 'quaternion', 'locator', 'accelOne', 'velocity'
      datasources: ['imu']
    };

    me.sphero.setBackLed(255); // 0-255, led brightness

    me.sphero.setStabilization(0);
    me.sphero.setDataStreaming(opts);
    me.sphero.streamImuAngles();

    me.sphero.on('dataStreaming', function ondatastream(data) {
      // XXX listening on 'data' would be less verbose
      me.emit('data', data)
    });
  }
});

robot.start();

module.exports = {
  robot: robot
}
