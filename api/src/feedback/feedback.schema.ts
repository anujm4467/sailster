import { FeedbackSchema, FeedbackSchemaIndex } from '../shared/feedback/feedback.schema';
import { schema } from '../utils/schema.util';

export const feedbackSchema = schema(FeedbackSchema, FeedbackSchemaIndex);
