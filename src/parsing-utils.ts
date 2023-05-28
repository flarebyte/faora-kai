import {type ZodSchema} from 'zod';
import {
  type Success,
  type FormatZodMessage,
  type ModelValidation,
} from './model.js';
import {formatMessageWithPrivacy} from './format-message-with-privacy.js';
import {formatFriendlyMessage} from './format-friendly-message.js';

type ZodMessageFormatting = 'human-friendly' | 'privacy-first';

type SafeParseOpts = {
  schema: ZodSchema;
  formatting: ZodMessageFormatting;
};

const getFormatter = (formatting: ZodMessageFormatting): FormatZodMessage => {
  switch (formatting) {
    case 'human-friendly': {
      return formatFriendlyMessage;
    }

    case 'privacy-first': {
      return formatMessageWithPrivacy;
    }

    default: {
      return formatFriendlyMessage;
    }
  }
};

/**
 * Parses an object in a safe manner that does not throw exceptions
 * @param content a javascript object (or JSON)
 * @param opts options with schema and expected formatting
 * @returns a successfullly parsed object or validation errors
 */
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

/**
 * Has the parsing of the object been successful
 * @param validationResult A validation result
 * @returns a successful validation result if any
 */
export function isParsingSuccessful<M extends Record<string, unknown>>(
  validationResult: ModelValidation<M>
): validationResult is Success<M> {
  return validationResult.status === 'success';
}
