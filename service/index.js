
const Koa = require( 'koa' );
const path = require( 'path' );
const koaBody = require( 'koa-body' );
const logger = require( 'koa-logger' );
const serve = require( 'koa-static' );
const Router = require( 'koa-router' );

const app = new Koa();
const router = new Router();

router.get( '/api/responsetype', async ( ctx ) => {

  // 返回页面 document
  // 不管返回的内容中带不带 html body 节点
  // 前端都会接收到完整的 html 页面
  if ( ctx.request.header.accept.indexOf( 'text/html' ) === 0 ) {
    ctx.body = `
      <html id="fake">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
        </head>
        <body>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
        </body>
      </html>
    `;
  } else if ( ctx.request.header.accept.indexOf( 'application/json' ) === 0 ) {
    ctx.body = {
      result: true,
      data: [ 1, 2, 3, 4, 5 ]
    };
  } else if ( ctx.request.header.accept.indexOf( 'application/xml' ) === 0 ) {
    ctx.body = `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
        </head>
        <body>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
        </body>
      </html>
    `;
  } else {
    ctx.throw( 400, '没有匹配到合适的类型' );
  }
});

app.use( koaBody());
app.use( logger());
app.use( serve( path.join( __dirname,  '../dist' )));
app.use( serve( path.join( __dirname,  '../examples' )));
app.use( router.routes()).use( router.allowedMethods());

// response
// app.use( ctx => {
//   ctx.body = 'Hello Koa';
// });

// app.use( async ( ctx ) => {
//   const body = ctx.request.body;
//   if ( !body.name ) ctx.throw( 400, '.name required' );
//   ctx.body = { name: body.name.toUpperCase() };
// });

app.listen( 3000, () => {
  console.log( 'server is starting at port 3000' );
});
