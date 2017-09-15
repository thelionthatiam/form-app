const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const pg = require('pg');
const path = require('path');
const { Client } = require('pg');
const { database_information } = require('./database/database_information');
const client = new Client(database_information);

client.connect();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

function basicQuery(t, v, cb) {
	console.log('step 2 - basicQuery');
	var text = t;
	var values = v;

	client.query(text, values, (err, res) => {
	  console.log('step 3 - call back from client query');
		if (err) {
	    	cb(err);
		} else {
			cb(null, res);
		}
	})
}

app.post('/myaction', function(req, res, next) {
  var values = [req.body.id, req.body.name];
  var text = 'INSERT INTO form_app(id, name) VALUES($1, $2) RETURNING *';

  basicQuery(text, values, (err, result) => {
    console.log('step 4 - callback from basicQuery, return to user');
    if (err) {
      res.send("Your input of " + req.body.id + " and " + req.body.name + " was not successful. Sorry.")
    } else {
      res.send("Your input of " + req.body.id + " and " + req.body.name + " was successful!");
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
