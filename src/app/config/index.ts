import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  salt_round: process.env.SALT_ROUND,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires: process.env.JWT_ACCESS_EXPIRES,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api: process.env.CLOUD_API,
  cloud_api_secret: process.env.CLOUD_API_SECRET,
};
