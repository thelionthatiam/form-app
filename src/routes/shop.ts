import * as express from 'express';
let router: any  = express.Router();

//render shop
router.get('/shop', function(req, res, next) {
  res.render('shop', { success:true });
});

export default router;
