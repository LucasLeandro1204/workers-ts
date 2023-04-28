import { Hono } from 'hono';
import { AbstractDurableObject, AbstractDOS } from './abstract';

export class FlowDurableObject extends AbstractDurableObject<AbstractDOS<{ count: number }>> {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  router() {
    const router = new Hono<AbstractDOS<{ count: number }>>();

    router.get('/', async (ctx) => {
      const count = await this.storage.get<number>('count') ?? 0;

      await this.storage.put('count', count + 1);

      return ctx.text(`Flow ${count}`, 200);
    });

    this.app.route('/', router);
  }
}
