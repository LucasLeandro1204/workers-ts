import { Hono } from 'hono';

type Variables<T> = {
  state: T & {
    storage: DurableObjectStorage;
  };
};

interface IntegrationHonoInterface {
  Bindings: Bindings;
  Variables: Variables<{ count: number } >;
}

function createIntegrationDurableObject() {
  const app = new Hono<IntegrationHonoInterface>();

  app.get('/', async (ctx) => {
    const state = ctx.get('state');

    await state.storage.put('count', state.count++);

    return ctx.text(`Integration ${state.count}`, 200);
  });

  return app;
}

export class IntegrationDurableObject {
  env: Env;
  app: Hono<IntegrationHonoInterface> = new Hono();

  constructor(state: DurableObjectState, env: Env) {
    const localState = {
      count: 0,
      storage: state.storage,
    };

    state.blockConcurrencyWhile(async () => {
      const stored = await state.storage.get<number>('count');
      localState.count = stored || 0;
    });

    this.env = env;
    this.app.use('*', async (ctx, next) => {
      ctx.set('state', localState);
      await next();
    });
    this.app.route('/integration', createIntegrationDurableObject());
  }

  async fetch(request: Request) {
    return this.app.fetch(request, this.env);
  }
}
