const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.post('/myaction', function(req, res, next) {
  console.log(req.body.id);
  res.send("Here is the id: " + req.body.id);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
