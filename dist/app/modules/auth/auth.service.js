"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const mailNotification_1 = require("../../../shared/mailNotification");
const config_1 = __importStar(require("../../../config"));
const user_model_1 = require("../user/user.model");
const mentor_model_1 = require("../mentor/mentor.model");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = payload;
    const isUserExist = yield user_model_1.User.isUserExist(userName);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const user = yield new user_model_1.User();
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatched(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { role, needsPasswordChange, userDetails, isVerified, _id } = isUserExist;
    const id = user === null || user === void 0 ? void 0 : user._id;
    const accessTokenData = {
        userName,
        role,
        userDetails: id,
        isVerified,
        id: _id,
    };
    if (role === 'mentor') {
        const mentor = yield mentor_model_1.Mentor.findOne({ userName: userName }).select('+adminApproval');
        if (!mentor.adminApproval) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Please wait for admin approval!');
        }
        accessTokenData.adminApproval = mentor.adminApproval;
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(accessTokenData, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userDetails, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needsPasswordChange,
    };
});
const emailVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, isForgetPassword } = payload;
    // console.log('id', id, 'password', password);
    // creating instance of User
    const user = new user_model_1.User();
    //  // access to our instance methods
    // const isUserExist = await user.isUserExist(id);
    const isUserExist = yield user_model_1.User.isUserExist(email);
    // const isUserExist= {id:'220100001',password:'fre8992',needsPasswordChange:false,role: 'student'}
    if (isForgetPassword || !!isUserExist) {
        const data = {
            from: config_1.ADMIN_EMAIL,
            to: email,
            subject: 'Reset Password',
            text: `Hi ${email} you have requested to reset your password. Please click on the link below to reset your password. ${config_1.NEXT_CLIENT_URL}/reset-password/${email}`,
        };
        (0, mailNotification_1.sendEmail)(data);
    }
    return {
        isUserExist: isUserExist ? true : false,
    };
});
const jwtVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = payload;
    let verifiedToken = null;
    // const verify = jwt.verify(token, config.jwt.secret as Secret);
    // console.log("verify",verify)
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        if ((verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.exp) > Date.now() / 1000) {
            // Perform email verification logic here
            yield user_model_1.User.findOneAndUpdate({ email: verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.email }, { isVerified: true }, {
                new: true,
            });
        }
        else {
            console.log('Token has expired');
        }
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.OK, (err === null || err === void 0 ? void 0 : err.message) === 'jwt expired' ? 'Token Expired' : 'Invalid Token');
    }
    return {
        token: verifiedToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
        if ((verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.exp) > Date.now() / 1000) {
            // Perform email verification logic here
            console.log('Verification successful:', verifiedToken);
        }
        else {
            console.log('Token has expired');
        }
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { userId } = verifiedToken;
    // tumi delete hye gso  kintu tumar refresh token ase
    // checking deleted user's refresh token
    const isUserExist = yield user_model_1.User.isUserExist(userId);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        //@ts-ignore
        id: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // // checking is user exist
    // const isUserExist = await User.isUserExist(user?.userId);
    //alternative way
    const isUserExist = yield user_model_1.User.findOne({ id: user === null || user === void 0 ? void 0 : user.email }).select('+password');
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // checking old password
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatched(oldPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Old Password is incorrect');
    }
    // // hash password before saving
    // const newHashedPassword = await bcrypt.hash(
    //   newPassword,
    //   Number(config.bycrypt_salt_rounds)
    // );
    // const query = { id: user?.userId };
    // const updatedData = {
    //   password: newHashedPassword,  //
    //   needsPasswordChange: false,
    //   passwordChangedAt: new Date(), //
    // };
    // await User.findOneAndUpdate(query, updatedData);
    // data update
    isUserExist.password = newPassword;
    isUserExist.needsPasswordChange = false;
    // updating using save()
    isUserExist.save();
});
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = payload;
    // // checking is user exist
    // const isUserExist = await User.isUserExist(user?.userId);
    //alternative way
    const isUserExist = yield user_model_1.User.findOne({ email: email }).select('+password');
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // checking old password
    // if (
    //   isUserExist.password &&
    //   !(await User.isPasswordMatched(oldPassword, isUserExist.password))
    // ) {
    //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
    // }
    // // hash password before saving
    // const newHashedPassword = await bcrypt.hash(
    //   newPassword,
    //   Number(config.bycrypt_salt_rounds)
    // );
    // const query = { id: user?.userId };
    // const updatedData = {
    //   password: newHashedPassword,  //
    //   needsPasswordChange: false,
    //   passwordChangedAt: new Date(), //
    // };
    // await User.findOneAndUpdate(query, updatedData);
    // data update
    isUserExist.password = newPassword;
    isUserExist.needsPasswordChange = false;
    // updating using save()
    isUserExist.save();
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgetPassword,
    emailVerification,
    jwtVerification,
};
