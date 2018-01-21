import { dbErrTranslator, compare } from '../../functions/helpers';
import * as express from 'express';
import { db } from '../../middleware/async-database';
const router = express.Router();


router.route('/products')
  .post((req, res) => {
    let product_id = req.body.product_id,
        universal_id = req.body.universal_id,
        price = req.body.price,
        name = req.body.name,
        description = req.body.description,
        size = req.body.size,
        img = req.body.img;

    let query = 'INSERT INTO products(product_id, universal_id, price, name, description, size, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    let input = [product_id, universal_id, price, name, description, size, img];

    db.query(query, input)
      .then((result) => {
        res.redirect('/admin/products');
      })
      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('error', { dbError: userError });
      });
  })
  .get((req, res) => {
    db.query("SELECT * FROM products", [])
      .then((result) => {
        let productContent = result.rows
        res.render('admin/products/products', {
          productContent:productContent
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

router.get('/new-product', (req, res, next) => {
  res.render('admin/products/new-product', {
    //
  })
})


router.route('/products/:product_id')
  .get((req, res) => {
    let product_id = req.query.product_id;

    db.query("SELECT * FROM products WHERE product_id = $1", [product_id])
      .then((result) => {
        let product = result.rows[0]
        res.render('admin/products/edit-product', {
          original_product_id:product_id,
          product_id: product.product_id,
          universal_id: product.universal_id,
          price: product.price,
          name: product.name,
          description: product.description,
          size: product.size,
          img: product.img,
        })
      })
      .catch((err) => {
        console.log(err.stack);
        res.render('error', { dbError: err.stack });
      });
    })
    .put((req, res) => {
      let product_id = req.body.product_id,
          universal_id = req.body.universal_id,
          price = parseInt(req.body.price),
          name = req.body.name,
          description = req.body.description,
          size = req.body.size,
          img = req.body.img,
          original_product_id = req.body.original_product_id;

      // console.log("product_id: \n",product_id, "universal_id: \n",universal_id, "price: \n",price, "name: \n",name, "description: \n",description, "size: \n",size, "img: \n",img, "original_product_id: \n",original_product_id)

      let query = 'UPDATE products SET (product_id, universal_id, price, name, description, size, image) = ($1, $2, $3, $4, $5, $6, $7) WHERE product_id = $8';
      let input = [product_id, universal_id, price, name, description, size, img, original_product_id]
      db.query(query, input)
        .then((result) => {
          res.redirect('/admin/products');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })
    .delete((req, res) => {
      let product_id = req.body.product_id;
      db.query('DELETE FROM products WHERE product_id = $1', [product_id])
        .then((result) => {
          res.redirect('/admin/products');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })


module.exports = router;
