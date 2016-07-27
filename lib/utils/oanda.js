'use strict';

const config = require('config');
const request = require('request');

const API = config.get('oanda.api');
const ACCOUNT_ID = config.get('oanda.accountId');
const ACCESS_TOKEN = config.get('oanda.accessToken');

function getPositions() {
  const requestOptions = {
    url: `${API}/v1/accounts/${ACCOUNT_ID}/positions`,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    }
  };

  return new Promise((resolve, reject) => {
    request(requestOptions, (err, response, body) => {
      if(err) return reject(err);

      let data;
      try {
        data = JSON.parse(body);

      } catch(e) {
        return reject(e);
      }

      return resolve(data);
    });
  });
}

function createOrder(instrument, units, type = 'market') {
  let side;
  if(units >= 0) {
    side = 'buy';

  } else {
    side = 'sell';
    units = -units;
  }

  const bodyData = {
    instrument: instrument,
    units: units,
    side: side,
    type: type,
  };

  const requestOptions = {
    method: 'POST',
    url: `${API}/v1/accounts/${ACCOUNT_ID}/orders`,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    // Content-Type is application/x-www-form-urlencoded
    form: bodyData
  };

  request(requestOptions, (err, response, body) => {
    if(err) return console.error(err);
    let data;
    try {
      data = JSON.parse(body);

    } catch(e) {
      return console.error(e);
    }

    console.log(`executed order - ${units} ${instrument} @ ${data.price}`);
  });
}

module.exports = {
  getPositions: getPositions,
  createOrder: createOrder,
};
