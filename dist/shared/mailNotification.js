"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const config_1 = require("../config");
const nodemailer = require('nodemailer');
const config = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: config_1.ADMIN_EMAIL,
        pass: 'eehe pxex temr lyjq'
    }
};
const sendEmail = (data) => {
    const transporter = nodemailer.createTransport(config);
    console.log("GOT THE MAIL TRIGGER");
    transporter.sendMail(data, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            return info.response;
        }
    });
};
exports.sendEmail = sendEmail;
