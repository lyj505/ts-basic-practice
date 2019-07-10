import express from 'express';

export function createEchoServer(port: number): Promise<any> {
  const app = express();
  app.use(express.json({ limit: '1MB' }));
  app.get('/', (req, res) => {
    const headers = {};
    for (let i = 0; i < req.rawHeaders.length - 1; i += 2) {
      // rawHeaders preserves original casing, etc.
      headers[req.rawHeaders[i]] = req.rawHeaders[i + 1];
    }
    res.json({
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      headers,
    });
  });

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
}
