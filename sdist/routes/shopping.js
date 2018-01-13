"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../functions/helpers");
const express = require("express");
const async_database_1 = require("../middleware/async-database");
const router = express.Router();
router.route('/products')
    .post((req, res) => {
    // all happens manually
})
    .get((req, res) => {
    let email = req.session.user.email;
    console.log('GET products');
    async_database_1.db.query('SELECT * FROM products', [])
        .then((result) => {
        let productContent = result.rows;
        for (let i = 0; i < productContent.length; i++) {
            productContent[i].email = email;
        }
        res.render('products', {
            productContent: productContent,
            email: email
        });
    })
        .catch((err) => {
        console.log(err);
        let userError = helpers_1.dbErrTranslator(err.message);
        res.render('products', { dbError: userError });
    });
});
module.exports = router;
//# sourceMappingURL=shopping.js.map