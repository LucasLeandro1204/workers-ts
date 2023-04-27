import { Hono } from 'hono';

export type AbstractDOS<T> = {
  Bindings: Bindings;
  Variables: Variables<T>;
};

export abstract class AbstractDurableObject<T> {
  env: Env;
  state: DurableObjectState;
  storage: DurableObjectStorage;
  app: Hono<AbstractDOS<T>> = new Hono();

  constructor(state: DurableObjectState, env: Env) {
    this.env = env;
    this.state = state;
    this.storage = state.storage;

    let localState: any = {};

    state.blockConcurrencyWhile(async () => {
      localState = await this.initialState();
    });

    this.app.use('*', async (ctx, next) => {
      ctx.set('state', localState);
      await next();
    });
    this.router();
  }

  async fetch(request: Request) {
    return this.app.fetch(request, this.env);
  }

  abstract router(): void;
  abstract initialState(): Promise<object>;
}
