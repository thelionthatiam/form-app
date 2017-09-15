const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const pg = require('pg');
const path = require('path');
const { Client } = require('pg');
const { database_information } = require('./database/database_information');
const client = new Client(database_information);
const validation = require('./validation');
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
  var values = [req.body.email, req.body.phone];
  var text = 'INSERT INTO form_app(email, phone) VALUES($1, $2) RETURNING *';

  basicQuery(text, values, (err, result) => {
    console.log('step 4 - callback from basicQuery, return to user');
    if (err) {
      var err = err.constraint;
      res.send(validation.errTranslator(err));
    } else {
      res.send("Your input of " + req.body.email + " and " + req.body.phone + " was successful!");
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
