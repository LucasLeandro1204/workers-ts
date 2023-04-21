import { Hono } from 'hono';

function createPingDurableObject(durable: DurableObjectState) {
  let count: number = 0;

  durable.blockConcurrencyWhile(async () => {
    const stored = await durable.storage.get<number>('count');
    count = stored || 0;
  });

  const app = new Hono<{ Bindings: Bindings }>();

  app.get('/pong', async (ctx) => {
    ++count;
    // durable.storage.put('count', count);
    return ctx.json({
      ok: true,
      message: `pong ${count}`,
    });
  });

  return app;
}

export class PingDurableObject {
  env: Env;
  app: Hono<{ Bindings: Bindings }>;

  constructor(state: DurableObjectState, env: Env) {
    this.env = env;
    this.app = createPingDurableObject(state);
  }

  async fetch(request: Request) {
    return this.app.fetch(request, this.env);
  }
}
