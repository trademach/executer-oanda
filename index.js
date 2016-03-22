'use strict';

const config = require('config');
const zmq = require('zmq');
const request = require('request');

// configured constants
const API = config.get('oanda.api');
const ACCOUNT_ID = config.get('oanda.accountId');
const ACCESS_TOKEN = config.get('oanda.accessToken');

const socket = zmq.socket('sub');

// store positions locally
let positions = {};

function init() {
  getCurrentPositions()
    .then(() => {
      socket.connect(config.get('mq.uri'));
      socket.subscribe(config.get('mq.topic'));
      socket.on('message', handleMessage);
    });
}

function handleMessage(topic, data) {
  const message = JSON.parse(data);

  console.log(message);
}

function getCurrentPositions() {
  const requestOptions = {
    url: `${API}/v1/accounts/${ACCOUNT_ID}/positions`,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    }
  };

  return new Promise((resolve, reject) => {
    request(requestOptions, (err, response, body) => {
      if(err) return console.error(err);

      const data = JSON.parse(body);

      data.positions.forEach(p => {
        const instrument = p.instrument;

        if(p.side === 'buy') {
          positions[instrument] = p.units;

        } else if(p.side === 'sell') {
          positions[instrument] = -p.units;
        }
      });

      console.log(positions);
    });
  });
}

init();
