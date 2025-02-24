import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { csrf } from 'hono/csrf';
import { serveStatic } from 'hono/bun';
import indexTemp from "./views/index.html" with { type: "text" };
import * as nunjucks from 'nunjucks';

const app = new Hono()

// csrf跨站请求伪造
app.use(csrf());
// 美化 json
app.use(prettyJSON());

// 静态资源目录
app.use('/static/*', serveStatic({ root: '/' }));
app.use('*', serveStatic({ root: '/static/' }));

app.get('*', (cxt) => {
  const html = nunjucks.renderString(indexTemp);
  return cxt.html(html);
})

export default app
