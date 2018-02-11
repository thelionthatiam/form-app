import * as express from 'express';
import * as r from '../resources/value-objects'
import { dbErrTranslator, compare, idMaker } from '../functions/helpers';
import { deepMerge } from '../functions/merge'
import { db } from '../middleware/database';
const router = express.Router();

router.route('/organizations')
  .post((req, res) => {
    // all happens via admin
  })
  .get((req, res) => {
    let user = r.UserSession.fromJSON(req.session.user)

    req.aQuery.selectOrgs([])
      .then((result) => {
        let organizationContent = result.rows;

        for (let i = 0; i < organizationContent.length; i++) {
          let org = r.OrgsDB.fromJSON(organizationContent[i]) // at least it catches problems
          organizationContent[i].email = user.email;
          organizationContent[i].frontEndID = idMaker(organizationContent[i].name)
        }

        res.render('shopping/organizations', {
          organizationContent:organizationContent,
          email: user.email
        })
      })
      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('shopping/organizations', { dbError: userError });
      });
  })


module.exports = router;
