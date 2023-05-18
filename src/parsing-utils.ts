import {type ZodSchema} from 'zod';
import {type ModelValidation} from './model.js';

export function safeParseBuild<M>(
  schema: ZodSchema,
  content: unknown
): ModelValidation<M> {
  const result = schema.safeParse(content);
  if (result.success) {
    return {value: result.data, status: 'success'};
  }

  const {
    error: {issues},
  } = result;
  const errors = issues.map(formatMessage);
  return {error: errors, status: 'failure'};
}
