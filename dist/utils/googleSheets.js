"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheets = void 0;
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("../config"));
dotenv_1.default.config();
const auth = new google_auth_library_1.JWT({
    email: config_1.default.google_service_account_email,
    key: config_1.default.google_private_key.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
exports.sheets = googleapis_1.google.sheets({ version: 'v4', auth });
