"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let router = express.Router();
//render shop
router.get('/shop', function (req, res, next) {
    res.render('shop', { success: true });
});
exports.default = router;
//# sourceMappingURL=shop.js.map