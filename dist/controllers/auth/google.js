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
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallback = exports.socialRedirect = void 0;
const googleapis_1 = require("googleapis");
const User_1 = require("../../entities/User");
const data_source_1 = require("../../data-source");
const token_1 = require("../../libs/token");
const customError_1 = require("../../libs/customError");
const REDIRECT_PATH = '/v1/auth/callback/';
const REDIRECT_URI = `${process.env.APP_URL}${REDIRECT_PATH}`;
const generators = {
    google() {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, `${REDIRECT_URI}google`);
        const url = oauth2Client.generateAuthUrl({
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ],
        });
        return url;
    },
};
/**
 * social login
 * GET /v1/auth/redirect/:provider (google)
 */
const socialRedirect = (req, res, next) => {
    const { provider } = req.params;
    if (provider !== 'google') {
        return next(new customError_1.CustomError(400, 'General', `해당 ${provider} provider는 존재하지 않습니다.`));
    }
    const loginUrl = generators[provider]();
    res.redirect(loginUrl);
};
exports.socialRedirect = socialRedirect;
/**
 * 구글 redirect uri
 * /v1/auth/callback/google
 */
const googleCallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    if (!code) {
        res.status(400).send();
        return;
    }
    try {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, `${REDIRECT_URI}google`);
        const { tokens } = yield oauth2Client.getToken(code);
        if (!tokens) {
            return next(new customError_1.CustomError(400, 'General', '해당 google token이 존재하지 않습니다.'));
        }
        oauth2Client.setCredentials(tokens);
        const { data } = yield googleapis_1.google.oauth2('v2').userinfo.get({ auth: oauth2Client });
        if (!data.id)
            return;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({
            where: {
                providerId: data.id,
            },
        });
        // login
        if (user) {
            const token = yield user.generateUserToken();
            (0, token_1.setTokenCookie)(res, token);
            res.redirect(`${process.env.ORIGIN}`);
            return;
        }
        // register
        const registerToken = (0, token_1.generateToken)({ email: data.email, provider: 'google', providerId: data.id }, { expiresIn: '1h' });
        res.cookie('registerToken', registerToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
        });
        res.redirect(`${process.env.ORIGIN}/auth/register`);
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.googleCallback = googleCallback;
