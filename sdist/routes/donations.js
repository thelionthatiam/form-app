"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../functions/helpers");
const express = require("express");
const database_1 = require("../middleware/database");
const router = express.Router();
let viewPrefix = 'shopping/';
router.route('/organizations')
    .post((req, res) => {
})
    .get((req, res) => {
    let email = req.session.user.email;
    database_1.db.query('SELECT * FROM organizations WHERE user_uuid = $1', [req.session.user.uuid])
        .then((result) => {
        let organizationContent = result.rows;
        for (let i = 0; i < organizationContent.length; i++) {
            organizationContent[i].email = email;
        }
        res.render(viewPrefix + 'organizations', {
            organizationContent: organizationContent,
            email: email
        });
    })
        .catch((err) => {
        console.log(err);
        let userError = helpers_1.dbErrTranslator(err.message);
        res.render(viewPrefix + 'organizations', { dbError: userError });
    });
});
module.exports = router;
//# sourceMappingURL=donations.js.map