import express, { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import randomstring from 'randomstring';
import passport from 'passport';
import { Op } from 'sequelize';

import '../models/Associations';
import User, {
  UserInstance,
  comparePassword,
  hashPassword,
} from '../models/User';
import PasswordResetToken from '../models/PasswordResetToken';

import auth from '../libs/auth';
import mail from '../libs/mail';
import { logger } from '../libs/logger';
import { ApplicationError, defaultCatch } from '../libs/errors';
import { any } from 'bluebird';

const router = express.Router();

/**
 * Log in using Passport.js; since they use a callback,
 * make a promisified version
 * @param req           Express.js request object
 * @param user          user to log in with
 * @return Promise.<token>
 */
async function login(req: Request, user: UserInstance) {
  await new Promise((resolve, reject) => {
    req.logIn(user, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
  return null;
}

/**
 * Middleware for checking the length of passwords in req.body
 * used for password changes and resets
 */
function checkPasswordLength(req: Request, res: Response, next: NextFunction) {
  const password = req.body.password;

  if (!password || password.length < 6) {
    res.json({
      success: false,
      messages: ['Please enter a non-empty new password of at least 6 letters'],
      errTypes: ['shortPassword'],
    });
    return;
  }

  next();
}

router.post('/register', checkPasswordLength, async (req, res) => {
  const password = _.isEmpty(req.body.password) ? null : req.body.password;
  // If password is null, it will be hashed as null too

  let user: UserInstance | null = null;

  try {
    const hash = await hashPassword(password);
    user = User.build({
      email: req.body.email,
      username: req.body.username,
      password: hash,
      activationKey: randomstring.generate(8),
      role: 'Normal',
      activated: false,
    });

    await user.validate();

    // Do deeper validation
    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({
        where: { email: user.email },
        attributes: ['id'],
      }),
      User.findOne({
        where: { username: user.username },
        attributes: ['id'],
      }),
    ]);

    const errors = [];
    if (existingEmail) {
      errors.push({
        message:
          'There already is a user with this email address; please sign in instead',
        type: 'emailExists',
      });
    }
    if (existingUsername) {
      errors.push({
        message: 'This username is already taken; please pick another one',
        type: 'usernameExists',
      });
    }

    if (errors.length !== 0) {
      throw new ApplicationError(errors);
    }

    await user.save();

    let mailSendSuccess = false;
    try {
      await mail.send(user.email, 'confirm', {
        username: user.username,
        activationKey: user.activationKey,
      });
      mailSendSuccess = true;
    } catch (err) {
      // This should not happen in regular operation
      logger.error('Mail send failed', { err });

      // Activate it automatically; it's not their fault
      user.activated = true;
      await user.save();
    }

    const message = mailSendSuccess
      ? 'You have successfully signed up! We have sent an activation email to your email address. In the meantime, you can start DOING BLAH (FILL THIS IN) without activating.'
      : 'You have successfully signed up! We have automatically activated your account because our email systems are currently not working.';

    // Immediately log in
    await login(req, user);
    res.json({
      success: true,
      messages: [message],
      user: auth.getUserOutput(user),
    });
  } catch (err) {
    defaultCatch(res)(err);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate(
    'local',
    {
      badRequestMessage: 'Please enter your email/username and password',
    } as any,
    async (err: Error | null, user: UserInstance | null) => {
      if (user) {
        try {
          await login(req, user);
          res.json({
            success: true,
            messages: ['You have successfully signed in'],
            user: auth.getUserOutput(user),
          });
        } catch (err) {
          res.json({
            success: false,
            messages: ['An unexpected error occured'],
          });
          logger.error('Login failed', { err });
        }
      } else {
        res.json({
          success: false,
          messages: [(err as Error).message],
        });
      }
    },
  )(req, res, next);
});

/**
 * Login as a given user
 */
router.get('/loginAs/:username', async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrator') {
      throw new ApplicationError([
        {
          message: 'Invalid request',
          type: 'invalidRequest',
        },
      ]);
    }

    const username = req.params.username;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
      },
    });

    if (!user) {
      throw new ApplicationError([
        {
          message: 'We could not find a matching user',
          type: 'userNotFound',
        },
      ]);
    }

    req.logout();
    await login(req, user);
    res.json({
      success: true,
      messages: ['We have logged you in as the user given'],
    });
  } catch (err) {
    defaultCatch(res)(err);
  }
});

router.post('/logout', (req, res) => {
  req.logout();
  const successResponse = {
    success: true,
    messages: ['You are now signed out'],
  };

  res.json(successResponse);
});

router.get('/confirm/:email/:activationKey', async (req, res) => {
  const user = await User.findOne({
    where: { email: req.params.email },
    attributes: ['id', 'email', 'activated', 'activationKey'],
  });

  if (!user || user.activationKey !== req.params.activationKey) {
    res.redirect('/?message=activationFailed');
  } else {
    if (!user.activated) {
      await login(req, user);
    }

    user.activated = true;
    await user.save();
    res.redirect('/?message=activated');
  }
});

router.post('/startResetPassword', async (req, res) => {
  try {
    const email = req.body.email;

    const errors = [];
    if (!email) {
      errors.push({
        message: "Please enter the account's email",
        type: 'emptyEmail',
      });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'username', 'email'],
    });

    if (!user) {
      throw new ApplicationError([
        {
          message:
            'We could not find a matching user; please check the entered email and username',
          type: 'userNotFound',
        },
      ]);
    }

    const token = await PasswordResetToken.create({
      userId: user.id as number,
      token: randomstring.generate(32),
    });

    try {
      await mail.send(user.email, 'resetPassword', {
        username: user.username,
        email: user.email,
        token: token.token,
      });
    } catch (err) {
      logger.error('Mail send failed for password request', { err });
      throw new ApplicationError([
        {
          message: 'We could send the recovery email. Please try again later',
          type: 'resetEmailSendFailed',
        },
      ]);
    }

    res.json({
      success: true,
      messages: [
        `We have sent an email to reset your password! Please check your inbox at ${
          user.email
        }`,
      ],
    });
  } catch (err) {
    defaultCatch(res)(err);
  }
});

/**
 * Change a user's password by hashing and setting it
 * @param user      sequelize user object
 * @param password  string of new password to set
 * @return Promise.<User>
 */
async function changePassword(user: UserInstance, password: string) {
  const hash = await hashPassword(password);
  user.password = hash;
  return user.save();
}

router.post('/resetPassword', checkPasswordLength, async (req, res) => {
  const password = req.body.password;
  // Assured to be non-empty by checkPasswordLength

  try {
    // 1. Check that we have the right token to change the password
    const token = await PasswordResetToken.findOne({
      where: { token: req.body.token },
      attributes: ['id', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'password'],
        },
      ],
    });

    if (!token) {
      throw new ApplicationError([
        {
          message: 'We could not find the matching password reset token',
          type: 'badPasswordToken',
        },
      ]);
    }

    const timeSinceCreation = Date.now() - (token.createdAt as Date).getTime();
    if (timeSinceCreation > 86400 * 1000) {
      throw new ApplicationError([
        {
          message:
            'This password reset token has expired. Please request another one by going to the Sign In page',
          type: 'expiredPasswordToken',
        },
      ]);
    }

    // 2. Actually change the user's password
    const tokenWithUser: any = token;
    const user = tokenWithUser.User;
    await changePassword(user, password);

    // 3. Invalidate the token
    await token.destroy();
    res.json({
      success: true,
      messages: [
        'Your password has been updated. You can now log in using the new password',
      ],
    });
  } catch (err) {
    defaultCatch(res)(err);
  }
});

// Check if password reset token is valid
router.get('/isValidPasswordResetToken', async (req, res) => {
  try {
    if (!req.query.token) {
      res.json({
        success: true,
        isValid: false,
      });
    }

    const token = await PasswordResetToken.findOne({
      where: { token: req.query.token },
      attributes: ['id'],
    });

    res.json({
      success: true,
      isValid: !!token,
    });
  } catch (err) {
    defaultCatch(res)(err);
  }
});

router.post(
  '/changePassword',
  auth.loginCheck,
  checkPasswordLength,
  async (req, res) => {
    try {
      const password = req.body.password;
      // Verified to be not empty by checkPasswordLength
      const curPassword = req.body.curPassword;

      if (!curPassword) {
        res.json({
          success: false,
          messages: ['Please enter your current password'],
          errTypes: ['curPasswordMissing'],
        });
      }

      const user = await User.findById(req.user.id, {
        attributes: ['id', 'password'],
      });

      if (!user) {
        throw new Error(
          'We somehow have a req.user with a given ID, but could not find that user in the DB',
        );
      }

      const matched = await comparePassword(curPassword, user.password);
      if (!matched) {
        throw new ApplicationError([
          {
            message: 'Your current password did not match',
            type: 'wrongCurPassword',
          },
        ]);
      }

      await changePassword(user, password);
      res.json({
        success: true,
        messages: ['Your password has been changed'],
      });
    } catch (err) {
      defaultCatch(res)(err);
    }
  },
);

router.get('/', (req, res) => {
  res.json({
    success: true,
    user: auth.getUserOutput(req.user),
  });
});

export default router;
