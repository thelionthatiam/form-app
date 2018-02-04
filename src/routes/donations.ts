import { dbErrTranslator, compare } from '../functions/helpers';
import * as express from 'express';
import { db } from '../middleware/database';
const router = express.Router();

let viewPrefix = 'shopping/'

router.route('/organizations')
  .post((req, res) => {

  })
  .get((req, res) => {
    let email = req.session.user.email;


    db.query('SELECT * FROM organizations WHERE user_uuid = $1', [req.session.user.uuid])
      .then((result) => {
        let organizationContent = result.rows;
        for (let i = 0; i < organizationContent.length; i++) {
          organizationContent[i].email = email;
        }
        res.render(viewPrefix + 'organizations', {
          organizationContent:organizationContent,
          email: email
        })
      })

      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render(viewPrefix + 'organizations', { dbError: userError });
      });
  })


module.exports = router;
