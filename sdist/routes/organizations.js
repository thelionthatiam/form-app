"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../functions/helpers");
const express = require("express");
const database_1 = require("../middleware/database");
const router = express.Router();
// GENERAL ORGS
// GENERAL ORGS
// GENERAL ORGS
router.route('/organizations')
    .post((req, res) => {
    // all happens via admin
})
    .get((req, res) => {
    let email = req.session.user.email;
    database_1.db.query('SELECT * FROM orgs', [])
        .then((result) => {
        let organizationContent = result.rows;
        for (let i = 0; i < organizationContent.length; i++) {
            organizationContent[i].email = email;
            organizationContent[i].frontEndID = helpers_1.idMaker(organizationContent[i].name);
        }
        console.log(organizationContent);
        res.render('organizations', {
            organizationContent: organizationContent,
            email: email
        });
    })
        .catch((err) => {
        console.log(err);
        let userError = helpers_1.dbErrTranslator(err.message);
        res.render('organizations', { dbError: userError });
    });
});
module.exports = router;
//# sourceMappingURL=organizations.js.map