import { Connection } from 'mongoose';
import { sailChecklistsSchema } from './sail-checklists.schema';

export const sailChecklistsProviders = [
  {
    provide: 'SAIL_CHECKLIST_MODEL',
    useFactory: (connection: Connection) => connection.model('SailChecklist', sailChecklistsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
