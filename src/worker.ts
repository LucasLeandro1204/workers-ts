import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { createFlowRouter } from './api/flow';

export function createWorker() {
  const app = new Hono<HonoInterface>();

  app.use('*', prettyJSON());
  app.use('*', cors({ origin: '*' }));
  app.get('/', (ctx) => ctx.text('Worker is running.'));

  app.route('/flow', createFlowRouter());

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
