"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const r = require("../config/resources");
const router = express.Router();
exports.router = router;
class BaseRequestHandler {
    constructor(req, res, nextPage, errPage) {
        this.req = req;
        this.res = res;
        this.inputs = req.query;
        this.db = req.db;
        this.nextPage = nextPage;
        this.errPage = errPage;
    }
    handler() {
        this.db.selectUser([this.inputs.email])
            .then((result) => {
            let user = new r.UserDB(result.rows[0]);
            return user;
        })
            .then((result) => {
            this.onSuccess(result);
        })
            .catch((error) => {
            this.onFailure(error);
        });
    }
    onSuccess(renderObj) {
        return this.res.render(this.nextPage, renderObj);
    }
    onFailure(error) {
        return this.res.render(this.errPage, { dbError: error });
    }
}
exports.BaseRequestHandler = BaseRequestHandler;
//# sourceMappingURL=test.js.map