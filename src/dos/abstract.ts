import { Hono } from 'hono';

export type AbstractDOS<T> = {
  Bindings: Bindings;
  Variables: Variables<T>;
};

export abstract class AbstractDurableObject<T> {
  env: Env;
  state: DurableObjectState;
  app: Hono<AbstractDOS<T>> = new Hono();

  constructor(state: DurableObjectState, env: Env) {
    this.env = env;
    this.state = state;

    let localState: any = {};

    state.blockConcurrencyWhile(async () => {
      localState = await this.initialState();
    });

    this.app.use('*', async (ctx, next) => {
      ctx.set('state', localState);
      await next();
    });
  }

  async fetch(request: Request) {
    return this.app.fetch(request, this.env);
  }

  abstract initialState(): Promise<object>;
}
