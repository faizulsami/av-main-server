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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const mentor_model_1 = require("../mentor/mentor.model");
const mentorSchedule_model_1 = require("../mentor/mentorSchedule.model");
const userDetails_model_1 = require("../userDetails/userDetails.model");
const user_model_1 = require("./user.model");
const createAdmin = (admin, user) => __awaiter(void 0, void 0, void 0, function* () {
    // If password is not given,set default password
    if (!user.password) {
        user.password = config_1.default.default_admin_pass;
    }
    // set role
    user.role = 'admin';
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newAdmin = yield userDetails_model_1.UserDetails.create([admin], { session });
        if (!newAdmin.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create faculty ');
        }
        user.userDetails = newAdmin[0]._id;
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield user_model_1.User.findOne({ id: newUserAllData.id }).populate({
            path: 'userDetails',
        });
    }
    return newUserAllData;
});
const createMentor = (mentor, user) => __awaiter(void 0, void 0, void 0, function* () {
    // If password is not given,set default password
    if (!user.password) {
        user.password = config_1.default.default_admin_pass;
    }
    // set role
    user.role = 'mentor';
    mentor.userName = user.userName;
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const defaultSchedule = {
            userName: user.userName,
            schedule: mentor.availability,
        };
        const newMentorSchedule = yield mentorSchedule_model_1.MentorSchedule.create([defaultSchedule], {
            session,
        });
        if (!newMentorSchedule.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create mentor shedule');
        }
        mentor.scheduleId = newMentorSchedule[0]._id;
        const newMentor = yield mentor_model_1.Mentor.create([mentor], { session });
        if (!newMentor.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create mentor ');
        }
        user.userDetails = newMentor[0]._id;
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create mentor');
        }
        newUserAllData = newUser[0];
        const token = jwtHelpers_1.jwtHelpers.createToken({ userId: user.id, email: user.email }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        console.log('token', token);
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield user_model_1.User.findOne({ id: newUserAllData.id }).populate({
            path: 'userDetails',
        });
    }
    return newUserAllData;
});
const isUsernameDuplicate = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if a user with the given username exists
        const existingUser = yield user_model_1.User.findOne({ userName });
        console.log(existingUser !== null);
        return existingUser !== null; // Returns true if a user is found, otherwise false
    }
    catch (error) {
        console.error('Error checking username duplicate:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Database error');
    }
});
const createMentee = (mentee, user) => __awaiter(void 0, void 0, void 0, function* () {
    // If password is not given,set default password
    if (!user.password) {
        user.password = config_1.default.default_admin_pass;
    }
    // set role
    user.role = 'mentee';
    mentee.userName = user.userName;
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newMentee = yield userDetails_model_1.UserDetails.create([mentee], { session });
        if (!newMentee.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create mentee ');
        }
        user.userDetails = newMentee[0]._id;
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create mentee');
        }
        newUserAllData = newUser[0];
        const token = jwtHelpers_1.jwtHelpers.createToken({ userId: user.id, email: user.email }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        // config.jwt.expires_in as string
        console.log('token', token);
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield user_model_1.User.findOne({ id: newUserAllData.id }).populate({
            path: 'userDetails',
        });
    }
    return newUserAllData;
});
const getSpecificUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
// const imageUpload = async (req:any,res:any): Promise<any> => {
// return new Promise((resolve,reject)=>{
//   const storage = multer.diskStorage({
//     destination:'./uploads/misc',
//     filename: function(req, file, cb) {
//       console.log('file',file)
//       cb(null, file.originalname);
//     }
//   })
//   const upload = multer({ storage: storage }).single('file');
//      upload(req, res, (err)=> {
//        if (err ){
//         console.log('UPLOAD ERR--->',err);
//         res.json({ uploaded: false, error: 'Upload failed' });
//       }
//       else {
//         console.log('else eecuted')
//       //    const newImage = new ImageUpload({
//       //     name: 'image',
//       //     image:{
//       //       data: 'this is file name',
//       //       contentType: 'image/png'
//       //     }
//       // })
//       // newImage.save().then((result:any)=>{
//       //   console.log(result);
//       // }).catch((err:any)=>{
//       //   console.log(err);
//       // } );
//        console.log('else eecuted')  };
//        const fileName = req.file.filename;
//        resolve ({"uploaded": true,
//        "url":`http://localhost:5000/misc/${fileName}`,
//        "fileName":fileName});
//     });
// })
// };
exports.UserService = {
    createAdmin,
    createMentor,
    createMentee,
    isUsernameDuplicate,
    getSpecificUser,
    // imageUpload
};
