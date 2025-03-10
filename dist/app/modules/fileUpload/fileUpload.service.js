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
exports.FileUploadService = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const imageUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const destination=req.body.destination ||'misc'
    const storage = multer_1.default.diskStorage({
        // destination:`./uploads/${destination}`,
        destination: (req, file, cb) => {
            const destination = req.query.destination || 'misc';
            const directory = `./uploads/${destination}`;
            if (!fs_1.default.existsSync(directory)) {
                fs_1.default.mkdirSync(directory, { recursive: true });
            }
            cb(null, directory);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    const upload = (0, multer_1.default)({ storage: storage }).single('file');
    upload(req, res, (err) => {
        if (err) {
            console.log('UPLOAD ERR--->', err);
            res.json({ uploaded: false, error: 'Upload failed' });
        }
        else {
            console.log('else eecuted');
            console.log('else eecuted');
        }
        ;
        const fileName = req.body.filename;
        console.log('fileName--->', fileName);
        return ({ "uploaded": true,
            "url": `http://localhost:5000/misc/${fileName}`,
            "fileName": fileName });
    });
});
exports.FileUploadService = {
    imageUpload
};
