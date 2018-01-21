import { dbErrTranslator, compare } from '../../functions/helpers';
import * as express from 'express';
import { db } from '../../middleware/async-database';
const router = express.Router();

//////////////
////////////// VARIABLES UNCHANGED
//////////////

router.route('/accounts')
  // .post((req, res) => {
  //   let product_id = req.body.product_id,
  //       universal_id = req.body.universal_id,
  //       price = req.body.price,
  //       name = req.body.name,
  //       description = req.body.description,
  //       size = req.body.size,
  //       img = req.body.img;
  //
  //   let query = 'INSERT INTO products(product_id, universal_id, price, name, description, size, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  //   let input = [product_id, universal_id, price, name, description, size, img];
  //
  //   db.query(query, input)
  //     .then((result) => {
  //       res.redirect('/admin/products');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       let userError = dbErrTranslator(err.message)
  //       res.render('error', { dbError: userError });
  //     });
  // })
  .get((req, res) => {
    let accountContent:any;
    let alarmContent:any;
    let alarmArray:any = [];
    let paymientContent;
    let paymentArray:any = [];

    db.query("SELECT * FROM users", [])
      .then((result) => {
        accountContent = result.rows

        for (let i = 0; i < accountContent.length; i++) {
          alarmArray.push(db.query('SELECT * FROM alarms WHERE user_uuid = $1', [accountContent[i].user_uuid]))
        }

        return Promise.all(alarmArray);
      })
      .then((result) => {
        for (let i = 0; i < result.length; i++) {
          accountContent[i].alarmContent = result[i].rows
        }

        for (let i = 0; i < accountContent.length; i++) {
          paymentArray.push(db.query('SELECT * FROM payment_credit WHERE user_uuid = $1', [accountContent[i].user_uuid]))
        }

        return Promise.all(paymentArray)
      })
      .then((result) => {
        for (let i = 0; i < result.length; i++) {
          accountContent[i].paymentContent = result[i].rows
        }

        res.render('admin/accounts/accounts', {
          accountContent:accountContent
        })
      })
      .catch((err) => {
        console.log(err)
        res.render('error', {
          errName: err.message,
          errMessage: null
        });
      });
  })

router.get('/new-account', (req, res, next) => {
  // res.render('admin/products/new-product', {
  //   //
  // })
})


router.route('/accounts/:user_uuid')
  // .get((req, res) => {
  //   let product_id = req.query.product_id;
  //
  //   db.query("SELECT * FROM products WHERE product_id = $1", [product_id])
  //     .then((result) => {
  //       let product = result.rows[0]
  //       res.render('admin/products/edit-product', {
  //         original_product_id:product_id,
  //         product_id: product.product_id,
  //         universal_id: product.universal_id,
  //         price: product.price,
  //         name: product.name,
  //         description: product.description,
  //         size: product.size,
  //         img: product.img,
  //       })
  //     })
  //     .catch((err) => {
  //       console.log(err.stack);
  //       res.render('error', { dbError: err.stack });
  //     });
  //   })
  //   .put((req, res) => {
  //     let product_id = req.body.product_id,
  //         universal_id = req.body.universal_id,
  //         price = parseInt(req.body.price),
  //         name = req.body.name,
  //         description = req.body.description,
  //         size = req.body.size,
  //         img = req.body.img,
  //         original_product_id = req.body.original_product_id;
  //
  //     // console.log("product_id: \n",product_id, "universal_id: \n",universal_id, "price: \n",price, "name: \n",name, "description: \n",description, "size: \n",size, "img: \n",img, "original_product_id: \n",original_product_id)
  //
  //     let query = 'UPDATE products SET (product_id, universal_id, price, name, description, size, image) = ($1, $2, $3, $4, $5, $6, $7) WHERE product_id = $8';
  //     let input = [product_id, universal_id, price, name, description, size, img, original_product_id]
  //     db.query(query, input)
  //       .then((result) => {
  //         res.redirect('/admin/products');
  //       })
  //       .catch((err) => {
  //         console.log(err.stack)
  //         res.render('error', { dbError: err.stack });
  //       });
  //   })
    .delete((req, res) => {
      let user_uuid = req.body.user_uuid;
      db.query('DELETE FROM users WHERE user_uuid = $1', [user_uuid])
        .then((result) => {
          res.redirect('/admin/accounts');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })

router.post('/gather-id', (req, res) => {
  console.log('gather id')
  req.session.admin.user_uuid = req.body.user_uuid;

  res.render('alarms/new-alarm', {
    email:req.body.user_uuid
  })
})

module.exports = router;
