"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
//render shop
app.get('/shop', function (req, res, next) {
    res.render('shop', { success: true });
});
module.exports = app;
//# sourceMappingURL=shop.js.map