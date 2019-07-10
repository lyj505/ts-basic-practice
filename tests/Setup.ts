import { closeHandles } from '../server/libs/utilities';

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled rejection:');
  console.error(err.stack);
});

afterAll(() => {
  closeHandles();
});
