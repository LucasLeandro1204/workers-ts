import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';

export function createWorker() {
  const app = new Hono<{ Bindings: Bindings }>();

  app.use('*', prettyJSON());
  app.get('/', (ctx) => ctx.text('Worker is running.'));

  app.get('/ping', async (ctx) => {
    const ping = ctx.env.PING.get(
      ctx.env.PING.idFromName('pong'),
    );
    const url = new URL(ctx.req.url);
    url.pathname = '/pong';

    return ping.fetch(url);
  });

  app.get('/ping2', async (ctx) => {
    const ping = ctx.env.PING.get(
      ctx.env.PING.idFromName('pong2'),
    );
    const url = new URL(ctx.req.url);
    url.pathname = '/pong';

    return ping.fetch(url);
  });

  app.notFound((ctx) => ctx.json({
    message: 'Not Found',
    ok: false,
  }, 404));

  return app;
}
