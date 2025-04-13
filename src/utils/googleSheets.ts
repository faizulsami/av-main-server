import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import config from '../config';
dotenv.config();

const auth = new JWT({
  email: config.google_service_account_email,
  key: config.google_private_key.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const sheets = google.sheets({ version: 'v4', auth });
