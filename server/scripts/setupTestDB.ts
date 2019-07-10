import requireDir from 'require-dir';
import db from '../libs/db';
import config from '../config';
requireDir('../models');

db.query(
  `CREATE DATABASE IF NOT EXISTS \`${
  config.dbDetails.database
  }\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
)
  .then(() => {
    return db.sync({ logging: console.log, force: true });
  })
  .then(() => {
    console.log('Done');
    process.exit();
  })
  .catch(err => {
    console.error('Ran into error while creating databases');
    console.error(err.stack);
  });
