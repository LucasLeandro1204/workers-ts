import { Hono } from 'hono';
import { AbstractDurableObject, AbstractDOS } from './abstract';

export class FlowDurableObject extends AbstractDurableObject<AbstractDOS<{ count: number }>> {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  router() {
    const router = new Hono<AbstractDOS<{ count: number }>>();

    router.get('/', async (ctx) => {
      const state = ctx.get('state');

      await this.storage.put('count', state.count++);

      return ctx.text(`Flow ${state.count}`, 200);
    });

    this.app.route('/', router);
  }

  async initialState() {
    const storage = this.state.storage;
    const count = await storage.get<any[]>('count');

    return {
      storage,
      count: count || 0,
    };
  }
}
