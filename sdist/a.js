class Pool {
    constructor() {
        this.items = [{ id: 1 }];
    }
    connect() {
        return new Promise((resolve, reject) => {
            if (this.items.length > 0) {
                resolve(this.items.pop());
            }
            else {
                reject(new Error("PoolEmpty"));
            }
        });
    }
    release(item) {
        this.items.push(item);
    }
}
let pool = new Pool();
console.log(pool.items);
console.log('conn undef');
pool.connect()
    .then((conn) => {
    console.log(pool.items);
    console.log(conn);
    let req = conn;
    console.log(pool.items);
    console.log(req);
    return req;
})
    .then((req) => {
    pool.release(req);
    console.log(pool.items);
    console.log(req);
    return req;
})
    .then((req) => {
    console.log(req);
})
    .catch((e) => console.error(e));
//# sourceMappingURL=a.js.map