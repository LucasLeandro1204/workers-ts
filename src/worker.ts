import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { createFlowRouter } from './api/flow';

export function createWorker() {
  const app = new Hono<HonoInterface>();

  app.use('*', cors({
    origin: 'http://localhost:8923',
    allowMethods: ['POST', 'HEAD', 'GET', 'OPTIONS'],
    credentials: true,
    allowHeaders: ['Teams-Enabled', 'cookies', 'cookie', 'Cookie', 'set-cookie', 'Time-Zone', 'Sent-By', 'Triggered-By', 'twProjectsVer', 'Accept', 'X-Requested-With'],
  }));
  app.use('*', prettyJSON());
  app.get('/', (ctx) => ctx.text('Worker is running.'));

  app.route('/flow', createFlowRouter());
  app.all('/proxy', (ctx) => {
    console.dir(JSON.stringify([...ctx.req.headers.entries()], null, 2));
    console.dir(ctx.req.cookie());
    return ctx.json({ success: true });
  });

  app.notFound((ctx) =>
    ctx.json(
      {
        message: 'Not Found',
        url: ctx.req.url,
        ok: false,
      },
      404,
    ),
  );

  return app;
}
