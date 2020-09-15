import { Strategy } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import config from 'config';
import UserModel from '../models/user'
import { User } from '../shared/models/user.model';
import { Config } from '../shared/models/config.model';
const { gcpClientSecret, gcpClientId } = config as Config;

export default function (passport: PassportStatic) {
  passport.use(
    new Strategy(
      {
        clientID: gcpClientId,
        clientSecret: gcpClientSecret,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const { sub: googleId, name: fullName, given_name,
          family_name, picture, email
        } = profile._json;

        const username = `${given_name}${family_name}`

        const newUser = {
          googleId, fullName, username,
          picture, email
        }

        try {
          const existingUser = await UserModel.findOne({ googleId }).lean();

          if (existingUser) {
            done(undefined, existingUser)
          } else {
            const createdUser: any = await UserModel.create(newUser)
            done(undefined, createdUser)
          }

        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user: User, done: any) => {
    done(null, user._id)
  })

  passport.deserializeUser((id: string, done: any) => {
    UserModel.findById(id, (err: any, user: User) => done(err, user))
  })
}
