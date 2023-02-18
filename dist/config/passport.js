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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = __importDefault(require("config"));
const user_1 = __importDefault(require("../models/user"));
const { gcpClientSecret, gcpClientId } = config_1.default;
function default_1(passport) {
    passport.use(new passport_google_oauth20_1.Strategy({
        clientID: gcpClientId,
        clientSecret: gcpClientSecret,
        callbackURL: '/api/auth/google/callback',
    }, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        const { sub: googleId, name: fullName, given_name, family_name, picture, email } = profile._json;
        const username = `${given_name}${family_name}`;
        const newUser = {
            googleId, fullName, username,
            picture, email
        };
        try {
            const existingUser = yield user_1.default.findOne({ googleId }).lean();
            if (existingUser) {
                done(undefined, existingUser);
            }
            else {
                const createdUser = yield user_1.default.create(newUser);
                done(undefined, createdUser);
            }
        }
        catch (err) {
            console.error(err);
        }
    })));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        user_1.default.findById(id, (err, user) => done(err, user));
    });
}
exports.default = default_1;
