const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.post('/myaction', function(req, res, next) {
  res.send("Here is the id: " + req.body.id + " and the name: " + req.body.name);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
