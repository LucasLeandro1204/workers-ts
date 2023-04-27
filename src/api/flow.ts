import { Hono } from 'hono';

export function createFlowRouter(): Hono<HonoInterface> {
  const router = new Hono<HonoInterface>();

  router.get('/flow/new', async (ctx) => {
    const id = ctx.env.FLOW.newUniqueId();

    return ctx.json({
      ok: true,
      data: id.toString(),
    });
  });

  router.use('/flow/:id', async (ctx) => {
    const url = new URL(ctx.req.url);
    const id = ctx.req.param('id');
    url.pathname = url.pathname.replace(`/flow/${id}`, '');

    const flow = ctx.env.FLOW.get(ctx.env.FLOW.idFromString(id));

    const response = await flow.fetch(new Request(url, ctx.req));

    return ctx.json({
      ok: true,
      data: await response.text(),
    });
  });

  return router;
}
