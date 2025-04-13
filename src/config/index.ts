/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_student_pass: process.env.DEFAULT_STUDENT_PASS,
  default_faculty_pass: process.env.DEFAULT_FACULTY_PASS,
  default_admin_pass: process.env.DEFAULT_ADMIN_PASS,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  sheet_name: process.env.SHEET_NAME,
  spreadsheet_id: process.env.SPREADSHEET_ID,
  google_service_account_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  google_private_key: process.env.GOOGLE_PRIVATE_KEY,
};
// export const NEXT_CLIENT_URL = "http://localhost:3000";
export const NEXT_CLIENT_URL = 'https://www.admaze.ca';

export const ADMIN_EMAIL = 'hello@admaze.ca';
