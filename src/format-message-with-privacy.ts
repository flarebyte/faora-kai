import {type StringValidation, type z} from 'zod';
import {type FormatZodMessage, type ValidationError} from './model.js';

const formatStringValidation = (stringValidation: StringValidation) =>
  typeof stringValidation === 'string'
    ? `It should be a ${stringValidation}`
    : 'It should have ' + Object.keys(stringValidation).join(',');

export const formatMessageWithPrivacy: FormatZodMessage = (
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
          formatStringValidation(issue.validation),
        ].join('; '),
      };
    }

    case 'invalid_enum_value': {
      return {
        path,
        message: 'The enum for the field is invalid',
      };
    }

    case 'invalid_literal': {
      return {
        path,
        message: 'The literal for the field is invalid',
      };
    }

    case 'invalid_union_discriminator': {
      return {
        path,
        message: 'The union discriminator for the object is invalid',
      };
    }

    case 'invalid_union': {
      return {
        path,
        message: 'The union for the field is invalid',
      };
    }

    case 'too_big': {
      return {
        path,
        message: `The ${issue.type} for the field is too big`,
      };
    }

    case 'too_small': {
      return {
        path,
        message: `The ${issue.type} for the field is too small`,
      };
    }

    case 'invalid_arguments': {
      return {
        path,
        message: 'The arguments are invalid',
      };
    }

    case 'invalid_return_type': {
      return {
        path,
        message: 'The return type is invalid',
      };
    }

    case 'invalid_date': {
      return {
        path,
        message: 'The date is invalid',
      };
    }

    case 'not_finite': {
      return {
        path,
        message: 'The number is not finite',
      };
    }

    case 'invalid_intersection_types': {
      return {
        path,
        message: 'The intersection types are invalid',
      };
    }

    case 'not_multiple_of': {
      return {
        path,
        message: 'The number is not the right multiple of',
      };
    }

    case 'unrecognized_keys': {
      return {
        path,
        message: 'The keys are not recognized',
      };
    }

    case 'custom': {
      return {
        path,
        message: 'The custom validation function did not pass',
      };
    }

    default: {
      return {
        path,
        message: 'The type for the field is incorrect',
      };
    }
  }
};
