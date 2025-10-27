import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
  emailDomain: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-this',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  emailDomain: process.env.EMAIL_DOMAIN || 'rishihood.edu.in'
};

// Validate critical config
if (!config.databaseUrl) {
  console.error('❌ ERROR: DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

export default config;
