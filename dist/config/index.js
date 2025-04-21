"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_EMAIL = exports.NEXT_CLIENT_URL = void 0;
/* eslint-disable no-undef */
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
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
exports.NEXT_CLIENT_URL = 'https://www.admaze.ca';
exports.ADMIN_EMAIL = 'hello@admaze.ca';
