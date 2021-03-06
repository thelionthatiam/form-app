"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const r = require("../resources/value-objects");
const router = express.Router();
exports.router = router;
class BaseRequestHandler {
    constructor(req, res, nextPage, errPage) {
        this.req = req;
        this.res = res;
        this.inputs = req.query;
        this.aQuery = req.aQuery;
        this.nextPage = nextPage;
        this.errPage = errPage;
    }
    handler() {
        this.aQuery.selectUser([this.inputs.email])
            .then((result) => {
            return r.UserDB.fromJSON(result.rows[0]);
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
//# sourceMappingURL=handlers.js.map