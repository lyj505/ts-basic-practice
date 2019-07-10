import axios from 'axios';
import { SerializedUser, Response } from '../../common/types';
import { processResponse } from './Ajax';

/**
 * Attempt a login with a given email and password
 * Returns a Promise
 * @param email
 * @param password
 * @return Promise.<object>
 */
export async function login(email: string, password: string) {
  const response = await axios({
    url: '/api/user/login',
    method: 'POST',
    data: { email, password },
  });
  return processResponse(response, 'user');
}

/**
 * Begin a password reset process
 * @param email       email of user to reset password for
 * @return Promise.<object>
 */
export async function startResetPassword(email: string) {
  const response = await axios({
    url: '/api/user/startResetPassword',
    method: 'POST',
    data: { email },
  });
  return response.data;
}

export interface RegistrationData {
  email: string;
  username: string;
  password: string;
}

/**
 * Register a user with given info
 * @param user  user with email, username, password
 * @return Promise.<object>
 */
export async function register(user: RegistrationData) {
  const response = await axios({
    url: '/api/user/register',
    method: 'POST',
    data: user,
  });
  return processResponse(response, 'user');
}

export async function getLoggedInUser(): Promise<SerializedUser | null> {
  const response = await axios({ url: '/api/user' });
  return processResponse(response, 'user');
}

export async function logout(): Promise<void> {
  await axios({ url: '/api/user/logout', method: 'POST' });
}

/**
 * Activate a user's account so that they can use the
 * /use endpoint
 * @param email          email of account to activate
 * @param activationkey  secret activation key
 * @return Promise.<data>
 */
export async function activate(email: string, activationKey: string) {
  const response = await axios({
    url: `/api/user/activate/${email}/${activationKey}`,
    method: 'POST',
  });
  return response.data;
}

/**
 * Check if a password reset token is valid
 * @param token       password reset token to use
 * @return Promise.<data>
 */
export async function isValidPasswordResetToken(
  token: string,
): Promise<boolean> {
  const response = await axios({
    url: '/api/user/isValidPasswordResetToken',
    params: { token },
  });
  return processResponse(response, 'isValid');
}

/**
 * Reset the password using a password reset token
 * @param token       password reset token to use
 * @param password    new password to use
 * @return Promise.<data>
 */
export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  const response = await axios({
    url: '/api/user/resetPassword',
    method: 'POST',
    data: { token, password },
  });
  return processResponse(response);
}
