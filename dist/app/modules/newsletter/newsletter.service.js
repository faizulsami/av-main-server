"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const googleSheets_1 = require("../../../utils/googleSheets");
const config_1 = __importDefault(require("../../../config"));
// import { NewsletterModel } from './newsletter.model';
const SPREADSHEET_ID = config_1.default.spreadsheet_id;
const SHEET_NAME = config_1.default.sheet_name;
const subscribeNewsletter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    if (!payload.email || !payload.email.includes('@')) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid email!');
    }
    const newsletter = yield googleSheets_1.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:B`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[email, new Date().toISOString().split('T')[0]]],
        },
    });
    // const newsletter = await NewsletterModel.create(payload);
    return newsletter;
});
exports.newsletterServices = { subscribeNewsletter };
