'use strict';

const config = require('config');
const zmq = require('zmq');
const request = require('request');

const socket = zmq.socket('sub');

function init() {
  socket.connect(config.get('mq.uri'));
  socket.subscribe(config.get('mq.topic'));
  socket.on('message', handleMessage);
}

function handleMessage(topic, data) {
  const message = JSON.parse(data);

  console.log(message);
}

init();
