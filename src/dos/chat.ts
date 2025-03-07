import { Hono } from 'hono';
import { AbstractDurableObject, AbstractDOS } from './abstract';

export class ChatDurableObject extends AbstractDurableObject<AbstractDOS<{ count: number }>> {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  router() {
    const router = new Hono<AbstractDOS<{ count: number }>>();

    router.get('/', async (ctx) => {
      const state = ctx.get('state');

      await this.storage.put('count', state.count++);

      return ctx.text(`Chat ${state.count}`, 200);
    });

    this.app.route('/chat', router);
  }

  async initialState() {
    const storage = this.state.storage;
    const state = await storage.get<number>('count');

    return {
      storage,
      count: state || 0,
    };
  }
}
