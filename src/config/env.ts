import dotenv from 'dotenv';

dotenv.config();

const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || 'postgres';

const defaultDbUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=matchstorm`;

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || defaultDbUrl,
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
