import { IConfig } from "config";

export interface Config extends IConfig {
    gcpClientSecret: string;
    gcpClientId: string;
    jwtPrivateKey: string;
    origin: string;
    callbackUrl: string;
    mongoUserName: string;
    mongoPassword: string;
}