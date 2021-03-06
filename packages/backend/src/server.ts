import '@tsed/swagger';

import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';
import { getBaseConfiguration } from '@yame/configuration';
import { Configuration } from '@yame/types';
import * as bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import methodOverride from 'method-override';
import * as path from 'path';

import { ExampleController } from './controllers/example.controller';

const rootDir = __dirname;
const clientDir = path.join(rootDir, '../../frontend/bundle');
const config: Configuration = getBaseConfiguration();

@ServerSettings({
  rootDir,
  acceptMimes: ['application/json'],
  httpPort: config.server.port,
  httpsPort: config.server.https,
  logger: {
    logRequest: config.server.log,
    requestFields: ['method', 'url'],
  },
  mount: {
    '/rest': [ExampleController],
  },
  swagger: [
    {
      path: '/docs',
    },
  ],
  statics: {
    '/': clientDir,
  },
})
export class Server extends ServerLoader {
  constructor(settings: any) {
    super(settings);
  }

  $beforeRoutesInit(): void | Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(cors())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        }),
      );
  }

  $afterRoutesInit(): void {
    this.expressApp.get('*', (_, res) => {
      res.sendFile(path.join(clientDir, 'index.html'));
    });
  }
}
