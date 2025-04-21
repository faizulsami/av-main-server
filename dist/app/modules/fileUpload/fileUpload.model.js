"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUpload = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String
    },
});
exports.ImageUpload = (0, mongoose_1.model)('ImageModel', ImageSchema);
