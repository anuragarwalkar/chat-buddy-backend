import jwt from 'jsonwebtoken';
import ErrorResponse from '../shared/errorResponse';
import { Request, Response, NextFunction } from 'express';

function auth (req: Request, res:Response, next:NextFunction){
    let authHeader = null; 
    let cookieToken = null;
    let token = null;

    // Get the Authorization token if provided in header.
    authHeader = req.header('authorization');

    // Get the Access Token if provided in cookies.
    if(req.cookies) cookieToken = req.cookies.access_token;

    // Setting token from header if present.
    if(authHeader) token = authHeader.split(" ")[1];

    // Setting token from cookie if present.
    if(cookieToken) token = cookieToken;

    // If header and cookies are not present.
    if(!authHeader && !cookieToken) {
    return next(new ErrorResponse('Access denied. No token provided.', 401));
    } 

    // Checkig JWT.
    try {
    // const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    
    // Adding decoded user in request object
    // req['user'] = decoded;
    
    // Allowing if token is valid.
    next();
    } catch (error) {
        return next(new ErrorResponse('Invalid token.', 401));
    }
}

export default auth;