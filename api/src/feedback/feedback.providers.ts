import { Connection } from 'mongoose';
import { feedbackSchema } from './feedback.schema';

export const feedbackProviders = [
  {
    provide: 'FEEDBACK_MODEL',
    useFactory: (connection: Connection) => connection.model('Feedback', feedbackSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
