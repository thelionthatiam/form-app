import { dbErrTranslator, compare } from '../functions/helpers';
import * as express from 'express';
import { db } from '../middleware/async-database';
const router = express.Router();


router.route('/products')
  .post((req, res) => {
    // all happens in on the server end
  })
  .get((req, res) => {
    let email = req.session.user.email;
    console.log('GET products')
    db.query('SELECT * FROM products', [])
      .then((result) => {
        let productContent = result.rows;
        for (let i = 0; i < productContent.length; i++) {
          productContent[i].email = email;
        }
        console.log(productContent)
        res.render('products', {
          productContent:productContent,
          email: email
        })
      })
      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('products', { dbError: userError });
      });
  })


module.exports = router;
