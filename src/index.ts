import { config as dotenvConfig } from 'dotenv';
import log4js from 'log4js';
import { useEnv } from './useEnv';
import config from './config';
import { connectToDatabase } from './database.connection';
import http from 'http';
import app from './app';

async function bootstrap(): Promise<void> {
  dotenvConfig();

  const { HOST, PORT, MONGO_ADDRESS } = useEnv();

  log4js.configure(config.log4js);

  const server = http.createServer(app);

  server.listen(PORT, HOST, async () => {
    log4js
      .getLogger()
      .info(`🚀 Example app listening on port: http://${HOST}:${PORT}`);
  });

  await connectToDatabase(MONGO_ADDRESS);
}

bootstrap();
