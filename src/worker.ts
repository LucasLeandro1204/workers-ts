import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

export function createWorker() {
  const app = new Hono<{ Bindings: Bindings }>();
  
  app.use('*', prettyJSON());
  app.use('*', cors({ origin: '*' }));
  app.get('/', (ctx) => ctx.text('Worker is running.'));

  const INTEGRATION_COOKIE = 'ls__instegration';

  app.get('/worker/notification', async (ctx) => {
    return ctx.json({
      ok: true,
      message: 'Notifications',
    });
  });

  app.use('/integration/*', async (ctx) => {
    const url = new URL(ctx.req.url);
    url.pathname = url.pathname.replace('/integration', '');

    const cookie = ctx.req.cookie(INTEGRATION_COOKIE);
    const id = cookie ? ctx.env.INTEGRATION.idFromString(cookie) : ctx.env.INTEGRATION.newUniqueId();

    const integration = ctx.env.INTEGRATION.get(id);

    return integration.fetch(new Request(url, ctx.req));
  });

  app.get('/ping', async (ctx) => {
    const ping = ctx.env.PING.get(ctx.env.PING.idFromName('pong'));
    const url = new URL(ctx.req.url);
    url.pathname = '/pong';

    return ping.fetch(url);
  });

  app.get('/ping2', async (ctx) => {
    const url = new URL(ctx.req.url);
    url.pathname = '/pong';

    const ping = ctx.env.PING.get(ctx.env.PING.idFromName('pong2'));
    return ping.fetch(url);
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
