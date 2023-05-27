import {type ZodSchema} from 'zod';
import {
  type Success,
  type FormatZodMessage,
  type ModelValidation,
} from './model.js';
import {formatMessageWithPrivacy} from './format-message-with-privacy.js';
import {formatMessage} from './format-message.js';

type ZodMessageFormatting = 'standard' | 'privacy-aware';

type SafeParseOpts = {
  schema: ZodSchema;
  formatting: ZodMessageFormatting;
};

const getFormatter = (formatting: ZodMessageFormatting): FormatZodMessage => {
  switch (formatting) {
    case 'standard': {
      return formatMessage;
    }

    case 'privacy-aware': {
      return formatMessageWithPrivacy;
    }

    default: {
      return formatMessage;
    }
  }
};

export function safeParse<M extends Record<string, unknown>>(
  content: unknown,
  opts: SafeParseOpts
): ModelValidation<M> {
  const result = opts.schema.safeParse(content);
  if (result.success) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value: M = result.data;
    const successful: ModelValidation<M> = {
      value,
      status: 'success',
    };
    return successful;
  }

  const formatter = getFormatter(opts.formatting);
  const {
    error: {issues},
  } = result;
  const errors = issues.map(formatter);

  const failure: ModelValidation<M> = {error: errors, status: 'failure'};
  return failure;
}

export function isParsingSuccessful<M extends Record<string, unknown>>(
  validationResult: ModelValidation<M>
): validationResult is Success<M> {
  return validationResult.status === 'success';
}
