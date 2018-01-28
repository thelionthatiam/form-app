"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
class BaseReqestHandler {
    constructor(req, res, query, input, nextPage, errPage) {
        this.req = req;
        this.res = res;
        this.query = query;
        this.input = input;
        this.db = req.db;
        this.nextPage = nextPage;
        this.errPage = errPage;
    }
    handler(promises) {
        return promises
            .then((ObjDB) => {
            this.onSuccess(ObjDB);
        })
            .catch((error) => {
            this.onFailure(error);
        });
    }
    onSuccess(ObjDB) {
        this.db.release();
        return this.res.render(this.nextPage, ObjDB);
    }
    onFailure(error) {
        this.db.release();
        return this.res.render(this.errPage, { dbError: error });
    }
}
exports.BaseReqestHandler = BaseReqestHandler;
module.exports = router;
//# sourceMappingURL=test.js.map