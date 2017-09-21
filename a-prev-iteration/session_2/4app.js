const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const pg = require('pg');
const path = require('path');
const { Client } = require('pg');
const { database_information } = require('./database/database_information');
const client = new Client(database_information);
const validation = require('./validation');

client.connect();

app.use(bodyParser.urlencoded({ extended: false }));

//view templating engine set up
app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'layout', layoutsDir:__dirname + '/views/layouts'}));
app.set('views', './views');
app.set('view engine', "hbs");
app.use(express.static(path.join(__dirname, 'public')));

//render home page
app.get('/', function (req, res) {
  res.render('index', {title: 'A pleasent form app', subtitle:'put all your cares aside'});
})

app.post('/submit', function(req, res, next) {
  var email = "You just submitted " + req.body.email + "!";
  var phone = "You just submitted " + req.body.phone + "!";
  res.render('index', {title: 'A pleasent form app', subtitle:'put all your cares aside', emailMessage: email, phoneMessage: phone});
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

app.post('/', function(req, res, next) {
  var values = [req.body.email, req.body.phone, req.body.password];
  var text = 'INSERT INTO form_app(email, phone, password) VALUES($1, $2, $3) RETURNING *';

  basicQuery(text, values, (err, result) => {
    console.log('step 4 - callback from basicQuery, return to user');
    if (err) {
      var err = validation.errTranslator(err.constraint);
      res.render('index', {title: 'A pleasent form app', subtitle:'put all your cares aside', dbError: err});
    } else {
      res.render('success', null);
    }
  });
})

app.listen(3000, function () {
  console.log('Form listening on port 3000');
})
