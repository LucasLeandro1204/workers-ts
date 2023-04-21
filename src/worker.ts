import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

export function createWorker() {
  const app = new Hono<{ Bindings: Bindings }>();

  app.use('*', prettyJSON());
  app.use('*', cors({ origin: '*' }));
  app.get('/', (ctx) => ctx.text('Worker is running.'));

  app.get('/worker/notification', async (ctx) => {
    return ctx.json({
      ok: true,
      message: 'Notifications',
    });
  });

  app.use('/integration/*', async (ctx) => {
    const url = new URL(ctx.req.url);
    url.pathname = url.pathname.replace('/integration', '');

    const id = ctx.env.INTEGRATION.newUniqueId();

    const integration = ctx.env.INTEGRATION.get(id);

    return integration.fetch(new Request(url, ctx.req));
  });

  app.get('/ping', async (ctx) => {
    const ping = ctx.env.PING.get(ctx.env.PING.idFromName('pong'));
    const url = new URL(ctx.req.url);
    url.pathname = '/pong';

    const res = await ping.fetch(new Request(url, ctx.req));

    return ctx.json({
      ok: true,
      data: await res.json(),
    });
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
