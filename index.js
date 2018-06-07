const Koa = require("koa");
const serve = require('koa-static');
const path = require('path');
const app = new Koa();
const main = serve(path.join(__dirname, "./public"));
const port = 3000;
const cp = require('child_process');
app.use(main);
app.listen(port, e => {
    console.log(`启动地址:127.0.0.1:${port}` )
    cp.exec(`start http://127.0.0.1:${port}/index.html`)
})