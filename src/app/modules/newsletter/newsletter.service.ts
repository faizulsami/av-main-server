import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { sheets } from '../../../utils/googleSheets';
import config from '../../../config';
// import { NewsletterModel } from './newsletter.model';

const SPREADSHEET_ID = config.spreadsheet_id;
const SHEET_NAME = config.sheet_name;

const subscribeNewsletter = async (payload: { email: string }) => {
  const { email } = payload;
  if (!payload.email || !payload.email.includes('@')) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email!');
  }

  const newsletter = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:B`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[email, new Date().toISOString().split('T')[0]]],
    },
  });

  // const newsletter = await NewsletterModel.create(payload);

  return newsletter;
};

export const newsletterServices = { subscribeNewsletter };
