import _ from 'lodash';
import { PassportStatic } from 'passport';
import PassportLocal from 'passport-local';
import { Op } from 'sequelize';
import '../models/Associations';
import User, { UserInstance, comparePassword } from '../models/User';
import { SerializedUser, serializedUserAttributes } from '../../common/types';
import { ApplicationError } from './errors';
import { NextFunction } from 'connect';
import { Request, Response } from 'express';

const LocalStrategy = PassportLocal.Strategy;

// Additional models to return with the user for MobX/Redux
const serializedIncludes: any[] = [
  // { model: SubModel }
];

export function getUserOutput(user: UserInstance): SerializedUser {
  return user.get({ plain: true }) as any;
}

export async function deserializeUser(userId: number) {
  const user = await User.findOne({
    where: { id: userId },
    attributes: serializedUserAttributes,
    include: serializedIncludes,
  });
  return user as UserInstance;
}

export function initializePassport(passport: PassportStatic) {
  passport.serializeUser(
    (user: UserInstance, done: (err: any, id?: number) => void) => {
      done(null, user.id);
    },
  );

  passport.deserializeUser(
    async (id: number, done: (err: any, user?: UserInstance) => void) => {
      try {
        const user = await deserializeUser(id);
        if (!user) {
          throw new Error(`No user with ID ${id} found`);
        }
        done(null, user);
      } catch (error) {
        console.error(error.stack);
        done(error);
      }
    },
  );

  const localStrategy = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (
      username: string,
      password: string,
      done: (
        error: Error | null,
        user: UserInstance | null,
        errObject: any,
      ) => void,
    ) => {
      try {
        const user = await User.findOne({
          where: {
            [Op.or]: [{ email: username }, { username }],
          },
          attributes: serializedUserAttributes.concat(['password']),
        });

        if (!user) {
          throw new ApplicationError([
            {
              type: 'username',
              message:
                'We could not find a user with the given username or email',
            },
          ]);
        }

        const matched = await comparePassword(password, user.password);
        if (!matched) {
          throw new ApplicationError([
            {
              type: 'password',
              message: 'The password is incorrect',
            },
          ]);
        }

        done(
          null,
          user,
          Object.assign(
            {
              message: 'You have successfully signed in!',
            },
            getUserOutput(user),
          ),
        );
      } catch (err) {
        done(err, null, err);
      }
    },
  );

  passport.use(localStrategy);
}

/**
 * Node.js middleware that ensures user is logged in,
 * and if not, return a default message
 */
export function loginCheck(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.json({
      success: false,
      messages: ['You must be logged in'],
      errType: 'notLoggedIn',
    });
    return;
  }

  next();
}

export default {
  getUserOutput,
  deserializeUser,
  initializePassport,
  loginCheck,
};
