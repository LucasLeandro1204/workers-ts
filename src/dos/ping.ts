export class PingDurableObject {
  count: number;
  storage: DurableObjectStorage;

  constructor(state: DurableObjectState, env: Env) {
    this.storage = state.storage;
    this.count = 0;
  }

  async fetch(request: Request) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/pong')) {
      return new Response(`pong ${this.count++}`);
    }

    return new Response('Not Found', { status: 404 });
  }
}
