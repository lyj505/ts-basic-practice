import * as dotenv from 'dotenv';

function getDBEnvFile() {
  const files = {
    local: '.env.dblocal',
    development: '.env.dbdev',
    production: '.env.dbprod',
    test: '.env.dbtest',
  };

  const defaultKey = 'development';
  return files[process.env.DATABASE || defaultKey] || files[defaultKey];
}

function getWebEnvFile() {
  const files = {
    development: '.env.webdev',
    production: '.env.webprod',
    test: '.env.webtest',
  };

  const defaultKey = 'development';
  return files[process.env.NODE_ENV || defaultKey] || files[defaultKey];
}

const dbEnvFile = getDBEnvFile();
const webEnvFile = getWebEnvFile();

// When webpacking on Windows and using the resulting file on a Mac,
// __dirname with backslashes doesn't play well
const dirname = __dirname.replace(/\\/g, '/');

dotenv.config({ path: `${dirname}/../${dbEnvFile}` });
dotenv.config({ path: `${dirname}/${dbEnvFile}` });
dotenv.config({ path: `${dirname}/../${webEnvFile}` });
dotenv.config({ path: `${dirname}/${webEnvFile}` });

const dbDetails = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || 'db_username',
  password: process.env.DB_PASS || '',
  database: process.env.DB_DATABASE || 'db_database',
};

const DEFAULT_WEB_PORT = 31765;

const config = {
  siteName: 'MySite',
  web: {
    port: process.env.WEB_PORT || DEFAULT_WEB_PORT,
    host: process.env.WEB_HOST || `localhost:${DEFAULT_WEB_PORT}`,
    linkHost: (() => {
      if (process.env.WEB_HOST) {
        const isLocalHost = process.env.WEB_HOST.match(/^localhost[^.]*$/);
        const scheme = isLocalHost ? 'http' : 'https';
        return `${scheme}://${process.env.WEB_HOST}`;
      }

      return `http://localhost:${DEFAULT_WEB_PORT}`;
    })(),
  },
  db:
    `mysql://${dbDetails.user}:${dbDetails.password}@${dbDetails.host}` +
    `:${dbDetails.port}/${dbDetails.database}`,
  dbDetails,
  sessionsSchema: {
    tableName: 'Sessions',
    columnNames: {
      session_id: 'id',
      expires: 'expires',
      data: 'data',
    },
  },
  mailFrom: process.env.MAIL_FROM || 'no-reply@mysite.com',
  smtp: {
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  hashSecret: process.env.HASH_SECRET,
  logPath: `${dirname}/../logs/log.txt`,

  // For queue
  redis: {
    port: 26379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  queueSuffix: process.env.QUEUE_SUFFIX || '',

  isProduction: process.env.NODE_ENV === 'production',
  logstashHost: process.env.LOGSTASH_HOST,
  logPort: 59300,
};

export default config;
export { dbDetails };
