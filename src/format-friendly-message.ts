import {type Primitive, type z} from 'zod';
import {type FormatZodMessage, type ValidationError} from './model.js';

const formatArray = (values: Array<string | number>) =>
  values.map((value) => `${value}`).join(',');

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
    .map((i) => i.path)
    .join(' or ');
}

export const formatFriendlyMessage: FormatZodMessage = (
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
        message: ['The string for the field is invalid', issue.message].join(
          '; '
        ),
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
          `I would review ${extractUnionErrors(issue)}`,
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

    case 'invalid_arguments': {
      return {
        path,
        message: ['The arguments are invalid', `${issue.message}`].join('; '),
      };
    }

    case 'invalid_return_type': {
      return {
        path,
        message: ['The return type is invalid', `${issue.message}`].join('; '),
      };
    }

    case 'invalid_date': {
      return {
        path,
        message: ['The date is invalid', `${issue.message}`].join('; '),
      };
    }

    case 'not_finite': {
      return {
        path,
        message: ['The number is not finite', `${issue.message}`].join('; '),
      };
    }

    case 'invalid_intersection_types': {
      return {
        path,
        message: [
          'The intersection types are invalid',
          `${issue.message}`,
        ].join('; '),
      };
    }

    case 'not_multiple_of': {
      return {
        path,
        message: [
          'The number is not the right multiple of',
          `${issue.message}`,
        ].join('; '),
      };
    }

    case 'unrecognized_keys': {
      return {
        path,
        message: ['The keys are not recognized', `${issue.message}`].join('; '),
      };
    }

    case 'custom': {
      return {
        path,
        message: [
          'The custom validation function did not pass',
          `${issue.message}`,
        ].join('; '),
      };
    }

    default: {
      return {
        path,
        message: `The type for the field is incorrect`,
      };
    }
  }
};
