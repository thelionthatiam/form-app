var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const validation = require('../middleware/validation');
const abFunc = require('../middleware/abstracted-functions')
// router.use(require('./forgot-password'))
router.use('/inSession', require('./account-information'));
router.use('/inSession', require('./change-account'));
router.use('/inSession', require('./delete-account'));
router.use('/inSession', require('./mailer'));
router.use('/inSession', require('./shop'));

//render home page
router.get('/', function (req, res) {
  res.render('index', { title: 'A pleasent form app', subtitle:'Put all your cares aside' });
})

//to sign up page
router.get('/to-login', function(req, res, next) {
  res.render('login', null );
});

// // login and set cookie data
// router.post('/to-account-actions', function(req, res, next) {
//   var text = 'SELECT * FROM users WHERE email = $1';
//   var values = [req.body.email];
//   req.conn.query(text, values, (err, result) => {
//     if (err) {
//       var error = validation.errTranslator(err.constraint);
//       res.render('login', { dbError: error });
//
//     } else if (result.rowCount === 0) {
//       res.render('login', { dbError: 'that email is not in the database' });
//
//     } else {
//       if (bcrypt.compareSync(req.body.password, result.rows[0].password)){
//         req.session.user = [req.body.email, result.rows[0].password];
//         res.render('account-actions', {title: 'Hi,', email:req.session.user[0]});
//
//       } else {
//         res.render('login', { dbError: 'Password is wrong.' });
//       }
//     }
//   })
// })

router.post('/login', function(req, res, next) {
  res.locals.thisPage = 'login';
  res.locals.nextPage = 'account-actions'

  abFunc.getRowFromEmail(req, res, next);
}, function(req, res, next) {
  if (res.locals.err !== undefined) {
    abFunc.renderWithDBError(res, res.locals.thisPage, res.locals.err);
  } else { next(); }

}, function(req,res,next) {
  if (res.locals === 'does not exist') {
    abFunc.renderWithError(res, res.locals.thisPage, 'Email not found.')
  } else { next(); }

}, function(req, res, next) {
  if (abFunc.unhashFailed(req.body.password, res.locals.row.password)) {
    abFunc.renderWithError(res, req.thisPage, 'Password incorrect.')
  } else { next(); }

}, function(req, res, next) {
  req.session.user = [res.locals.row.email, res.locals.row.password];
  abFunc.renderNextPage(res, res.locals.nextPage, {title: 'yo', email: res.locals.row.email })
})




router.post('/to-log-out', function (req,res,next) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err.stack)
    } else {
      req.session = null;
      res.render('index', {title:"A pleasent form app", subtitle:"Welcome back!" });
    }
  })
});

//to sign up page
router.get('/to-create-account', function(req, res, next) {
  res.render('create-account', {success: false});
});

//sends user information to database,
router.post('/create-account', function (req, res, next) {
  var password = bcrypt.hashSync(req.body.password, 10);
  var values = [req.body.email, req.body.phone, password];
  var text = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';

  req.conn.query(text, values, (err, result) => {

    if (err) {
      console.log(err);
      var error = validation.errTranslator(err.constraint);
      res.render('create-account', { dbError: error, success:false });

    } else {
      res.render('create-account', { success: true, email: req.body.email, phone: req.body.phone });

    }
  });
})

// general error handling
router.get('/an-error', function(req, res, next) {
  res.render('nowhere-land', null)
})

module.exports = router;
