"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const help = require("../functions/promise-helpers");
const bcrypt = require("bcrypt");
const async_database_1 = require("../middleware/async-database");
const router = express.Router();
//to sign up page
router.get('/new-account', function (req, res, next) {
    console.log('/to-create');
    res.render('new-account', { success: false });
});
router.post('/delete', function (req, res, next) {
    res.render('login', {
        accountDelete: true,
    });
});
router.route('/authorized')
    .post((req, res) => {
    var output = {};
    async_database_1.db.query("SELECT * FROM users WHERE email = $1", [req.body.email])
        .then((result) => {
        if (result.rows.length === 0) {
            throw new Error("Email not found");
        }
        else {
            output = result.rows[0];
            return bcrypt.compare(req.body.password, result.rows[0].password);
        }
    })
        .then((result) => {
        if (result === false) {
            throw new Error('Password incorrect');
        }
        else {
            req.session.user = {
                uuid: output.user_uuid,
                id: output.id,
                email: output.email,
                phone: output.phone,
                password: output.password
            };
            console.log(req.session);
            res.render('home', {
                title: "yo",
                email: req.session.user.email
            });
        }
    })
        .catch((error) => {
        res.render('login', { dbError: error });
    });
});
router.post('/log-out', function (req, res, next) {
    console.log("before destroy", req.session);
    req.session.destroy(function (err) {
        if (err) {
            res.render('error', { errName: err.message, errMessage: null });
        }
        else {
            console.log("after destory", req.session);
            res.render('login');
        }
    });
});
router.get('/home', (req, res) => {
    console.log("home page", req.session);
    res.render('home', {
        title: "yo",
        email: req.session.user.email
    });
});
router.route('/accounts')
    .get((req, res) => {
    res.render('account', {
        email: req.session.user.email,
        phone: req.session.user.phone
    });
})
    .post((req, res) => {
    let inputs = {
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        id: '',
        nonce: ''
    };
    console.log('POST account');
    bcrypt.hash(inputs.password, 10)
        .then((hash) => {
        inputs.password = hash;
        console.log('created hash', hash);
        return async_database_1.db.query('INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *', [inputs.email, inputs.phone, inputs.password]);
    })
        .then((result) => {
        console.log('inserted', inputs.password, 'into user table ', result);
        inputs.id = result.rows[0].user_uuid;
        return help.randomString;
    })
        .then((string) => {
        console.log('created', string);
        return bcrypt.hash(string, 10);
    })
        .then((hash) => {
        inputs.nonce = hash;
        console.log('created another hash', hash);
        return async_database_1.db.query('INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2) RETURNING *', [inputs.id, inputs.nonce]);
    })
        .then((result) => {
        console.log('inserted', inputs.nonce, 'into nonce table ', result);
        res.render('new-account', {
            success: true,
            email: inputs.email,
            phone: inputs.phone,
        });
    })
        .catch((err) => {
        console.log(err);
        res.render('new-account', {
            dbError: err.message
        });
    });
});
router.route('/accounts/:email')
    .get((req, res) => {
    res.render('my-account', {
        email: req.session.user.email,
        phone: req.session.user.phone
    });
})
    .put((req, res) => {
    async_database_1.db.query('UPDATE users SET (email, phone) = ($1, $2) WHERE user_uuid = $3', [req.body.email, req.body.phone, req.session.user.uuid])
        .then((result) => {
        console.log(result);
        res.render('my-account', {
            title: "account updated",
            email: req.session.user.email,
            success: true,
        });
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('my-account', { dbError: err.stack });
    });
})
    .delete((req, res) => {
    async_database_1.db.query('DELETE FROM users WHERE user_uuid = $1', [req.session.user.uuid])
        .then((result) => {
        res.render('login', {
            message: "account was deleted, please make a new one to enter"
        });
    });
});
router.route('/accounts/:email/password')
    .get((req, res) => {
    res.render('new-password', {
        email: req.session.user.email
    });
})
    .post((req, res) => {
    console.log;
    let inputs = {
        password: req.body.password,
        oldPassword: req.body.oldPassword
    };
    async_database_1.db.query("SELECT * FROM users WHERE user_uuid = $1", [req.session.user.uuid])
        .then((result) => {
        console.log(result);
        return bcrypt.compare(req.body.oldPassword, result.rows[0].password);
    })
        .then((result) => {
        console.log(result);
        if (result === false) {
            throw new Error('Password incorrect');
        }
        else {
            return bcrypt.hash(inputs.password, 10);
        }
    })
        .then((hash) => {
        console.log(hash);
        inputs.password = hash;
        return async_database_1.db.query('UPDATE users SET (password) = ($1) WHERE user_uuid = $2', [inputs.password, req.session.user.uuid]);
    })
        .then((result) => {
        res.render('new-password', {
            success: true,
            email: req.session.user.email
        });
    })
        .catch((error) => {
        res.render('new-password', { dbError: error });
    });
});
module.exports = router;
//# sourceMappingURL=account.js.map