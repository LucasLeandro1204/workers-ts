export class PingDurableObject {
  storage: DurableObjectStorage;

  constructor(state: DurableObjectState, env: Env) {
    this.storage = state.storage;
  }

  async fetch(request: Request) {
    const { pathname } = new URL(request.url);

    if (pathname === '/ping') {
      return new Response('pong');
    }

    return new Response('Not Found', { status: 404 });
  }
}
