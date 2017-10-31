const express = require('express');
const router = express.Router();
//render shop
router.get('/shop', function (req, res, next) {
    res.render('shop', { success: true });
});
module.exports = router;
