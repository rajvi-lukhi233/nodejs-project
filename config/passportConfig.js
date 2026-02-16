import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { createUser, findOne } from '../src/services/auth.service.js';
import { PROVIDER } from '../src/utils/constant.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await findOne({ googleId: profile.id, email: profile.emails[0].value });
        if (!user) {
          user = await createUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            provider: PROVIDER.GOOGLE,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
