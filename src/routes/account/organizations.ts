import { dbErrTranslator, compare } from '../../functions/helpers';
import * as express from 'express';
import { db } from '../../middleware/database';
const router = express.Router();

// MY ORGS
// MY ORGS
// MY ORGS


router.route('/organizations')
  .post((req, res) => {
    let org = req.body.org_uuid;
    let userOrgs;

    db.query('SELECT * FROM user_orgs WHERE user_uuid = $1', [req.session.user.uuid])
    .then((result) => {
      userOrgs = result.rows

      for (let i = 0; i < userOrgs.length; i++) {
        if (userOrgs[i].org_uuid === org) {
          throw new Error('You have already added this org!')
        }
      }

      if (result.rowCount >= 2) {
        throw new Error('You can only save 2 organizations to favorites right now.')
      }  else {
        db.query('INSERT INTO user_orgs(user_uuid, org_uuid) VALUES ($1, $2)', [req.session.user.uuid, org])
      }
    })
    .then((result) => {
      res.redirect('/accounts/' + req.session.user.uuid + '/organizations' )
    })
    .catch((error) => {
      console.log(error);
      error = {error:error}
      res.render('account/my-organizations', error)
    })
  })
  .get((req, res) => {
    let email = req.session.user.email;

    db.query('SELECT * FROM organizations WHERE user_uuid = $1', [req.session.user.uuid])
      .then((result) => {
        let organizationContent = result.rows;
        for (let i = 0; i < organizationContent.length; i++) {
          organizationContent[i].email = email;
        }
        res.render('organizations', {
          organizationContent:organizationContent,
          email: email
        })
      })

      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('organizations', { dbError: userError });
      });
  })

router.route('/organizations/:sku')
  .put((req,res) => {
    let userOrgs;
    let addingOrg = req.body.org_uuid
    db.query('UPDATE user_orgs SET active = $1 WHERE user_uuid = $2', [false, req.session.user.uuid])
      .then((result) =>{
        return db.query('UPDATE user_orgs SET active = $1 WHERE user_uuid = $2 AND org_uuid = $3', [true, req.session.user.uuid, addingOrg])
      })
      .then((result) => {
        res.redirect('/accounts/' + req.session.user.uuid + '/organizations' )
      })
      .catch((error) => {
        console.log(error)
        res.render('account/my-organizations', error)
      })
  })

module.exports = router;
