import { IConfig } from "config";

export interface Config extends IConfig {
    gcpClientSecret: string;
    gcpClientId: string;
    jwtPrivateKey: string;
    origin: string;
    mongoUserName: string;
    mongoPassword: string;
}