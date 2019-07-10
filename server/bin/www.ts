#!/usr/bin/env node
import 'source-map-support/register';
import app from '../app';
import { AddressInfo } from 'net';
import config from '../config';

app.set('port', process.env.PORT || config.web.port);

process.on('uncaughtException', error => {
  console.error(error.message);
  console.error(error.stack);
});

const server = app.listen(app.get('port'), () => {
  console.info(
    `Express server listening on port ${
      (server.address() as AddressInfo).port
    }`,
  );
});
