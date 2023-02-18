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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const dBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mongoUserName, mongoPassword } = config_1.default;
        const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false };
        const connection = yield mongoose_1.default.connect(`mongodb+srv://${mongoUserName}:${mongoPassword}@cluster0.gxn0le4.mongodb.net/?retryWrites=true&w=majority`, options);
        console.log(`Mongo Db connected to ${connection.connection.host}`);
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.default = dBConnection;