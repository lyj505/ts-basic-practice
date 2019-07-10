import User, { hashPassword } from '../server/models/User';

export interface MakeUserOptions {
  email?: string | null;
  username?: string | null;
  role?: 'Normal' | 'Administrator' | null;
  password?: string | null;
  activationKey?: string | null;
  activated?: boolean | null;
}

let counter = 1000000000;

export async function makeDBUser(options: MakeUserOptions = {}) {
  const email = options.email || `testEmail+${counter}@example.com`;
  const username = options.username || `username${counter}`;
  const password = options.password || `password${counter}`;
  const activationKey = options.activationKey || `${counter}`.substr(-8);
  counter++;

  const dataToCreate = {
    email,
    username,
    role: options.role || 'Normal',
    password: await hashPassword(password),
    activationKey,
    activated: !!options.activated,
  };

  return User.create(dataToCreate);
}

export default {
  makeDBUser,
};
