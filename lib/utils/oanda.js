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

module.exports = {
  getPositions: getPositions,
};
