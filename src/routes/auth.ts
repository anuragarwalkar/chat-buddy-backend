import express, { NextFunction, Response, Request } from 'express';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../shared/errorResponse';
import bcrypt from 'bcrypt';
import usersModel from '../models/users';
// import _ from 'lodash';

const router = express.Router();

router.post('/sign-in', asyncHandler( async (req: Request, res:Response, next:NextFunction) => {
  // Object Destructuring request body 
  let { email, password } = req.body;

  // If body does not exist email & password throw error to client.
  if(!email || !password) return next(new ErrorResponse('Invalid email or password', 400));

  // Getting Client Details from collection
  const user: any = await usersModel.findOne({ email });

  if(!user) return next(new ErrorResponse('Invalid email or password', 400));

  // Validating Credentials 
  const validCredentials = await bcrypt.compare(password, user.password);

  // If credentials are not valid throw error to client.
  if(!validCredentials) return next(new ErrorResponse('Invalid password.',400));

  // Generating JWT
  const token = user.generateAuthToken(user.username, user.fullName, email);

  // Setting cookies into browser
  const httpOnly = true;

  res.cookie('access_token', token, { httpOnly });
  res.cookie('isLoggedIn', validCredentials);


  // Sending final response
  res.send(
      { success:true, data: {
      username: user.username,
      email: user.email,
      token }
  });
}));

router.post('/sign-up',asyncHandler(async (req: Request, res:Response, next:NextFunction)=>{
  let { username, password, email, fullName } = req.body;

  if(!username || !password || !email || !fullName) {
    return next(new ErrorResponse('Please send client details', 400));
  }
  
  // Generating salt to hash a password
  const salt = await bcrypt.genSalt(10)

  // Modifying plain text password to hashed one
  password = await bcrypt.hash(password, salt);

  // Creating client in clients collection
  const clientDetails: any = await usersModel.create({username, email, password, fullName});

  // Generating JWT
  clientDetails.token = clientDetails.generateAuthToken(username, fullName, email);
  
  // Getting Client details
  const {_id: userId, token } = clientDetails;

  // Setting cookie 
  res.cookie('access_token', token, { httpOnly: true });
  res.cookie('isLoggedIn', true);
  
  // Sending final response
  res.status(201).send({success:true, data: { userId, email, username, token }});
}));

export default router;
