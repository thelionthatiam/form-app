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
    console.log(req.session.user)
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
        console.log(req.session.user.uuid, org)
        db.query('INSERT INTO user_orgs(user_uuid, org_uuid) VALUES ($1, $2)', [req.session.user.uuid, org])
      }
    })
    .then((result) => {
      res.redirect('/accounts/' + req.session.user.uuid + '/organizations' )
    })
    .catch((error) => {
      console.log(error);
      error = {error:error}
      res.render('shopping/organizations', error)
    })
  })
  .get((req, res) => {
    let name:string,
        description:string,
        cause:string,
        link:string,
        defaultSet:boolean = false;

    let email = req.session.user.email;
    db.query('SELECT x.org_uuid, name, description, link, cause, active FROM orgs x INNER JOIN user_orgs y ON x.org_uuid = y.org_uuid AND (user_uuid = $1)', [req.session.user.uuid])
      .then((result) => {
        let organizationContent = result.rows;
        for (let i = 0; i < organizationContent.length; i++) {
          organizationContent[i].email = email;
          console.log( organizationContent[i].link)
          if (organizationContent[i].active) {
            defaultSet = true;
            name = organizationContent[i].name
            description = organizationContent[i].description
            link = organizationContent[i].link
            cause = organizationContent[i].cause
          }
        }
        res.render('account/my-organizations', {
          organizationContent:organizationContent,
          email: email,
          name:name,
          description:description,
          cause:cause,
          link:link,
          defaultSet:defaultSet
        })
      })

      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('account/my-organizations', { dbError: userError });
      });
  })


// MUST FLIP BOOL
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
  .delete((req,res) => {
    let org_uuid = req.body.org_uuid;
    db.query('DELETE FROM user_orgs WHERE user_uuid = $1 AND org_uuid = $2', [req.session.user.uuid, org_uuid])
    .then((result) => {
      res.redirect('/accounts/' + req.session.user.uuid + '/organizations' )
    })
    .catch((error) => {
      console.log(error)
      res.render('account/my-organizations', error)
    })
  })

module.exports = router;
