import 'reflect-metadata';
import { Connection, getConnection, createConnection } from 'typeorm';
import { User, UserAuth } from './entity';

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

let connectionReadyPromise: Promise<Connection> | null = null;

export const prepareConnection = () => {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (err) {
        console.log(err, 'db/entity/index/20行 数据库连接错误');
      }

      const connection = await createConnection({
        type: 'mysql',
        host,
        port,
        username,
        password,
        database,
        entities: [User, UserAuth],
        synchronize: false,
        logging: true,
      });
      return connection;
    })();
  }
  return connectionReadyPromise;
};
