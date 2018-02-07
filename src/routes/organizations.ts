import { dbErrTranslator, compare, idMaker } from '../functions/helpers';
import * as express from 'express';
import { deepMerge } from '../functions/merge'
import { db } from '../middleware/database';
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
    db.query('SELECT * FROM orgs', [])
      .then((result) => {
        let organizationContent = result.rows;
        for (let i = 0; i < organizationContent.length; i++) {
          organizationContent[i].email = email;
          organizationContent[i].frontEndID = idMaker(organizationContent[i].name)
        }
        console.log(organizationContent)
        res.render('shopping/organizations', {
          organizationContent:organizationContent,
          email: email
        })
      })
      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('shopping/organizations', { dbError: userError });
      });
  })


module.exports = router;
