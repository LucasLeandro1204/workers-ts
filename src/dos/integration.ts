import { Hono } from 'hono';

function createIntegrationDurableObject(durable: DurableObjectState) {
  let count: number = 0;

  durable.blockConcurrencyWhile(async () => {
    const stored = await durable.storage.get<number>('count');
    count = stored || 0;
  });

  const app = new Hono<{ Bindings: Bindings }>();

  return app;
}

export class IntegrationDurableObject {
  env: Env;
  app: Hono<{ Bindings: Bindings }>;

  constructor(state: DurableObjectState, env: Env) {
    this.env = env;
    this.app = createIntegrationDurableObject(state);
  }

  async fetch(request: Request) {
    return this.app.fetch(request, this.env);
  }
}
