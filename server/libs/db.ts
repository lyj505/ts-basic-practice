import Sequelize, { Options } from 'sequelize';
import config from '../config';
import { logger } from './logger';

const options: Options = {
  logging: false,
};

if (process.env.NODE_SQL_LOG) {
  options.logging = logger.info;
}

const db = new Sequelize(config.db, options);
export default db;
