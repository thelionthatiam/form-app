var express = require('express');
var router = express.Router();
// import * as express from 'express';
// let router: any  = express.Router();
//render shop
router.get('/shop', function (req, res, next) {
    res.render('shop', { success: true });
});
module.exports = router;
//# sourceMappingURL=shop.js.map