import { Hono } from 'hono';
import { AbstractDurableObject, AbstractDOS } from './abstract';

function createChatDurableObject() {
  const app = new Hono<AbstractDOS<{ count: number }>>();

  app.get('/', async (ctx) => {
    const state = ctx.get('state');

    await state.storage.put('count', state.count++);

    return ctx.text(`Chat ${state.count}`, 200);
  });

  return app;
}

export class ChatDurableObject extends AbstractDurableObject<AbstractDOS<{ count: number }>> {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.app.route('/chat', createChatDurableObject());
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
