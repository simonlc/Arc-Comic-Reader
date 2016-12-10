import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from './models/user';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// TODO Find how to send better messages (@simonlc not even sure what this means)
passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return done(null, false, {
        message: 'Incorrect credentials.',
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      return done(null, user);
    }

    return done(null, false, { message:
      'Incorrect credentials.',
    });
  }
));
