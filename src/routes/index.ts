import * as express from 'express';
const router = express.Router();
import * as test from './test';

router.use('/', require('./authorization'));
router.use('/', require('./email'));
router.use('/', require('./accounts'));
router.use('/', require('./shopping'));
router.use('/', require('./organizations'));
router.use('/', test.router);
router.use('/', require('./mock-alarm'));

router.use('/admin', require('./admin/products'));
router.use('/admin', require('./admin/coupons'));
router.use('/admin', require('./admin/accounts'));


router.use('/accounts', require('./account'));
router.use('/accounts/:email', require('./account/alarms'));
router.use('/accounts/:email', require('./account/payment'));
router.use('/accounts/:email', require('./account/organizations'));
router.use('/accounts/:email', require('./account/cart'));
router.use('/accounts/:email', require('./account/coupons'));
router.use('/accounts/:email', require('./account/orders'));
router.use('/accounts/:email', require('./account/settings'));


router.get('/login', function (req, res, next) {
  res.render('login');
})

// NEEDS GUEST AND USER BEHAVIOR
router.get('/contact', function (req, res, next) {
  res.render('contact');
})

router.get('/splash', function (req, res, next) {
  res.render('splash');
})

router.get('/home', (req, res) => {
  console.log("home page", req.session)
  res.render('home', {
    email:req.session.user.email,
    name: req.session.user.name
  })
})

module.exports = router;
