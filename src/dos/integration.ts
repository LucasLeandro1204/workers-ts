import { Hono } from 'hono';

type Variables = {
  storage: DurableObjectStorage
  count: number;
};

interface IntegrationHonoInterface {
  Bindings: Bindings;
  Variables: Variables;
}

function createIntegrationDurableObject() {
  const app = new Hono<IntegrationHonoInterface>();

  app.get('/', async (ctx) => {
    const count = ctx.get('count') + 1;

    ctx.set('count', count);

    return ctx.text(`Integration ${count}`, 200);
  });

  return app;
}

export class IntegrationDurableObject {
  env: Env;
  app: Hono<IntegrationHonoInterface> = new Hono();

  constructor(state: DurableObjectState, env: Env) {
    let count = 0;

    state.blockConcurrencyWhile(async () => {
      const stored = await state.storage.get<number>('count');
      count = stored || 0;
    });

    this.env = env;
    this.app.use('*', async (ctx, next) => {
      console.log('lol');
      ctx.set('storage', state.storage);
      ctx.set('count', count);
      await next();
      count = ctx.get('count');
      state.storage.put('count', count);
    });
    this.app.route('/integration', createIntegrationDurableObject());
  }

  async fetch(request: Request) {
    return this.app.fetch(request);
  }
}
