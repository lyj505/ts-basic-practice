// import randomstring from 'randomstring';
// import mail from './mail';
// import User from '../models/User';
// import FakeData from '../../tests/FakeData';
// import { truncateTables } from '../../tests/Utilities';
// import PasswordResetToken from '../models/PasswordResetToken';

// beforeAll(async () => {
//   truncateTables([User]);
// });

// describe('mail', () => {
//   it('sends an activation email', async () => {
//     jest.setTimeout(10000);

//     const user = await FakeData.makeDBUser({ email: 'px.peter.xu@gmail.com' });
//     await mail.send('px.peter.xu@gmail.com', 'confirm', { user });
//   });

//   it.only('sends an password reset email', async () => {
//     jest.setTimeout(10000);

//     const user = await FakeData.makeDBUser({ email: 'px.peter.xu@gmail.com' });
//     const token = await PasswordResetToken.create({
//       userId: user.id as number,
//       token: randomstring.generate(32),
//     });
//     await mail.send('px.peter.xu@gmail.com', 'resetPassword', {
//       email: user.email,
//       username: user.username,
//       token: token.token,
//     });
//   });
// });
