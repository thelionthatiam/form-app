"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const r = require("../resources/value-objects");
const helpers_1 = require("../functions/helpers");
const router = express.Router();
router.route('/organizations')
    .post((req, res) => {
    // all happens via admin
})
    .get((req, res) => {
    let user = r.UserSession.fromJSON(req.session.user);
    req.Query.selectOrgs([])
        .then((result) => {
        let organizationContent = result.rows;
        for (let i = 0; i < organizationContent.length; i++) {
            let org = r.OrgsDB.fromJSON(organizationContent[i]); // at least it catches problems
            organizationContent[i].email = user.email;
            organizationContent[i].frontEndID = helpers_1.idMaker(organizationContent[i].name);
        }
        res.render('shopping/organizations', {
            organizationContent: organizationContent,
            email: user.email
        });
    })
        .catch((err) => {
        console.log(err);
        let userError = helpers_1.dbErrTranslator(err.message);
        res.render('shopping/organizations', { dbError: userError });
    });
});
module.exports = router;
//# sourceMappingURL=organizations.js.map