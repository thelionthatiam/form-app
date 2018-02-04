import { dbErrTranslator, compare } from '../functions/helpers';
import * as express from 'express';
import { db } from '../middleware/database';
const router = express.Router();

let viewPrefix = 'shopping/'

router.route('/products')
  .post((req, res) => {
    // all happens via admin
  })
  .get((req, res) => {
    let email = req.session.user.email;
    db.query('SELECT * FROM products', [])
      .then((result) => {
        let productContent = result.rows;
        for (let i = 0; i < productContent.length; i++) {
          productContent[i].email = email;
        }
        res.render(viewPrefix + 'products', {
          productContent:productContent,
          email: email
        })
      })
      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render(viewPrefix + 'products', { dbError: userError });
      });
  })


module.exports = router;
