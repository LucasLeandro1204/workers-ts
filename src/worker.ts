import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';

export function createWorker() {
  const app = new Hono<{ Bindings: Env }>();

  app.use('*', prettyJSON());
  app.get('/', (ctx) => ctx.text('Worker is running.'));

  app.get('/ping', (ctx) => {
    const ping = ctx.env.PING.get(
      ctx.env.PING.idFromName('pong'),
    );

    return ping.fetch(ctx.req.raw);
  });

  app.notFound((ctx) => ctx.json({
    message: 'Not Found',
    ok: false,
  }, 404));

  return app;
}
