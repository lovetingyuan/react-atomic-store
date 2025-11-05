import { Hono } from 'hono';
// import { readFile } from 'fs/promises'
// import { resolve } from "path";

const api = new Hono();

// We strongly recommend that you use the full API path to define routes.
api.get('/test', (c) => {
  return c.json({ text: 'this is api response, id is ' + c.req.query('id') });
});

api.post('/init-ws', async (c) => {
  const res = await import('./ws');
  return c.json({
    code: 0,
    data: {
      port: res.PORT,
    },
  });
});

// api.get('/client', async c => {
//   // const script = await readFile(filePath, 'utf-8')
//   const script = `(${main})();`
//    return c.text(script, 200, {
//      'Content-Type': 'application/javascript'
//    })
// })

export { api };
