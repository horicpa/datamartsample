import https from 'https';
import fs from 'fs';
import next from 'next';

const nextStartServer = async () => {
  const app = next({ dev: true });
  const handle = app.getRequestHandler();

  await app.prepare();

  const options = {
    key: fs.readFileSync('/tmp/certs/key.pem'),
    cert: fs.readFileSync('/tmp/certs/cert.pem'),
  };

  const server = https.createServer(options, (req, res) => {
    handle(req, res);
  });

  server.listen(3000, '0.0.0.0', () => {
    console.log('> Ready on https://0.0.0.0:3000');
  });
};

nextStartServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
