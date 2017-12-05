import * as express from 'express';
const app = express();

//render shop
app.get('/shop', function(req, res, next) {
  res.render('shop', { success:true });
});

module.exports = app;
