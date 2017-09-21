const { Client } = require('pg');

function init(databaseInformation) {
  return function (req, res, next) {
    const client = new Client(databaseInformation); // change this to POOL
    req.conn = client;
    res.on('end', function () {
      client.close(); // when the request is done (when response is sent) - close the connections.
    });
    res.on('error', function () {
      client.close(); // when the request is done (when response is sent) - close the connections.
    })
    next();
  });
}

module.exports = {
  init: init
};
