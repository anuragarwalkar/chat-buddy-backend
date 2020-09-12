import express from 'express';
const router = express.Router();

/* GET users listing. */
router.post('/', async (req, res, next) => {
  // Object Destructuring request body 
  let { username, password } = req.body;

  // If body does not exist Client id & Client Secret throw error to client.
  // if(!username || !password) return next(new ErrorResponse('Invalid username or password', 400));

  // Getting Client Details from collection
  // const user = await clientModel.findOne({ username });

  // Get user details from mongodb collection. 
  // const user: any =  await getUserDetailsById(authUser);

  // Validating Credentials 
  // const validCredentials = await bcrypt.compare(clientSecret, client.clientSecret);

  // If credentials are not valid throw error to client.
  // if(!validCredentials) return next(new ErrorResponse('Invalid clientId or clientSecret',400));

  // Generating JWT
  // const token = client.generateAuthToken(authUser, user.name, user.role);

  // Setting cookies into browser
  const httpOnly = true;
  const expiresIn = 3600;
  const maxAge = expiresIn * 1000;

  // res.cookie('access_token', token, { httpOnly, maxAge });
  // res.cookie('isLoggedIn', validCredentials, { maxAge });


  // Sending final response
  // res.send(
  //     { success:true,
  //     data: {
  //     clientId,
  //     token,
  //     expiresIn, 
  //     user }
  // });
});

export default router;
