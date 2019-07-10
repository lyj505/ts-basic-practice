import Queue from 'bull';
// import moment from 'moment';
// import config from '../config';
// import { UserInstance } from '../models/User';

// const { queueSuffix } = config;

// Example: add queues here, and instantiate them
// const SAMPLE_QUEUE = `sample${queueSuffix}`;

// export const sampleQueue = new Queue(SAMPLE_QUEUE, {
//   redis: config.redis,
// });

// export async function queueSampleJob(
//   user: UserInstance,
// ): Promise<UserInstance> {
//   const job = await sampleQueue.add(
//     'sample',
//     { userId: user.id },
//     { attempts: 3 },
//   );
//   user.emailCheckJobId = job.id as number;
//   user.emailCheckLastQueuedAt = moment.utc().toDate();
//   return user.save();
// }

const queues: Queue.Queue[] = [];

/** Clear all queues; useful for testing */
export function cleanAllQueues() {
  return Promise.all(queues.map(queue => queue.clean(0)));
}

export default {
  // sampleQueue,
  // queueSampleJob,
  cleanAllQueues,
};
