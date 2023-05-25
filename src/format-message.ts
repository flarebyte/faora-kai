import {type Primitive, type StringValidation, type z} from 'zod';
import {type FormatZodMessage, type ValidationError} from './model.js';

const formatArray = (values: Array<string | number>) =>
  values.map((value) => `${value}`).join(',');

const formatStringValidation = (stringValidation: StringValidation) =>
  typeof stringValidation === 'string'
    ? stringValidation
    : JSON.stringify(stringValidation);

const formatUnknown = (value: unknown) => {
  switch (typeof value) {
    case 'string': {
      return value;
    }

    case 'number': {
      return `${value}`;
    }

    case 'boolean': {
      return value ? 'true' : 'false';
    }

    default: {
      return `typeof ${typeof value}`;
    }
  }
};

const formatPrimitive = (value: Primitive) => {
  switch (typeof value) {
    case 'string': {
      return value;
    }

    case 'number': {
      return `${value}`;
    }

    case 'boolean': {
      return value ? 'true' : 'false';
    }

    default: {
      return `typeof ${typeof value}`;
    }
  }
};

const formatPrimitives = (values: Primitive[]) =>
  values.map(formatPrimitive).join(',');

function extractUnionErrors(
  issue: z.ZodInvalidUnionIssue & {fatal?: boolean | undefined; message: string}
): string {
  return issue.unionErrors
    .flatMap((err) => err.issues)
    .map((i) => i.message + '???')
    .join('.');
}

export const formatMessage: FormatZodMessage = (
  issue: z.ZodIssue
): ValidationError => {
  const path = issue.path.join('.');
  switch (issue.code) {
    case 'invalid_type': {
      return {
        path,
        message: [
          'The type for the field is invalid',
          `I would expect ${issue.expected} instead of ${issue.received}`,
        ].join('; '),
      };
    }

    case 'invalid_string': {
      return {
        path,
        message: [
          'The string for the field is invalid',
          `${issue.message} with constraint ${formatStringValidation(
            issue.validation
          )}`,
        ].join('; '),
      };
    }

    case 'invalid_enum_value': {
      return {
        path,
        message: [
          'The enum for the field is invalid',
          `I would expect any of ${formatArray(issue.options)} instead of ${
            issue.received
          }`,
        ].join('; '),
      };
    }

    case 'invalid_literal': {
      return {
        path,
        message: [
          'The literal for the field is invalid',
          `I would expect ${formatUnknown(issue.expected)}`,
        ].join('; '),
      };
    }

    case 'invalid_union_discriminator': {
      return {
        path,
        message: [
          'The union discriminator for the object is invalid',
          `I would expect any of ${formatPrimitives(issue.options)}`,
        ].join('; '),
      };
    }

    case 'invalid_union': {
      return {
        path,
        message: [
          'The union for the field is invalid',
          `I would check ${extractUnionErrors(issue)}`,
        ].join('; '),
      };
    }

    case 'too_big': {
      return {
        path,
        message: [
          `The ${issue.type} for the field is too big`,
          `I would expect the maximum to be ${issue.maximum}`,
        ].join('; '),
      };
    }

    case 'too_small': {
      return {
        path,
        message: [
          `The ${issue.type} for the field is too small`,
          `I would expect the minimum to be ${issue.minimum}`,
        ].join('; '),
      };
    }

    default: {
      return {
        path,
        message: [
          'The type for the field is incorrect',
          `${issue.message}`,
        ].join('; '),
      };
    }
  }
};
