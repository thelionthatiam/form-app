"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../functions/helpers");
const express = require("express");
const database_1 = require("../middleware/database");
const router = express.Router();
let viewPrefix = 'shopping/';
router.route('/products')
    .post((req, res) => {
    // all happens via admin
})
    .get((req, res) => {
    let email = req.session.user.email;
    database_1.db.query('SELECT * FROM products', [])
        .then((result) => {
        let productContent = result.rows;
        for (let i = 0; i < productContent.length; i++) {
            productContent[i].email = email;
        }
        res.render(viewPrefix + 'products', {
            productContent: productContent,
            email: email
        });
    })
        .catch((err) => {
        console.log(err);
        let userError = helpers_1.dbErrTranslator(err.message);
        res.render(viewPrefix + 'products', { dbError: userError });
    });
});
module.exports = router;
//# sourceMappingURL=shopping.js.map