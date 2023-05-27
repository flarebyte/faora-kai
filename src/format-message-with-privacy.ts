/* eslint-disable @typescript-eslint/naming-convention */
import {type StringValidation, type z} from 'zod';
import {type FormatZodMessage, type ValidationError} from './model.js';

const formatStringValidation = (stringValidation: StringValidation) =>
  typeof stringValidation === 'string'
    ? `It should be a ${stringValidation}`
    : 'It should have ' + Object.keys(stringValidation).join(',');

const privacyFirstMessages = {
  invalid_type: 'The type for the field is invalid',
  invalid_string: 'The string for the field is invalid',
  invalid_enum_value: 'The enum for the field is invalid',
  invalid_literal: 'The literal for the field is invalid',
  invalid_union_discriminator:
    'The union discriminator for the object is invalid',
  invalid_union: 'The union for the field is invalid',
  invalid_arguments: 'The arguments are invalid',
  invalid_return_type: 'The return type is invalid',
  invalid_date: 'The date is invalid',
  not_finite: 'The number is not finite',
  invalid_intersection_types: 'The intersection types are invalid',
  not_multiple_of: 'The number is not the right multiple of',
  unrecognized_keys: 'The keys are not recognized',
  custom: 'The custom validation function did not pass',
  default: 'The type for the field is incorrect',
};

export const formatMessageWithPrivacy: FormatZodMessage = (
  issue: z.ZodIssue
): ValidationError => {
  const path = issue.path.join('.');
  switch (issue.code) {
    case 'invalid_type': {
      return {
        path,
        message: [
          privacyFirstMessages.invalid_type,
          `I would expect ${issue.expected} instead of ${issue.received}`,
        ].join('; '),
      };
    }

    case 'invalid_string': {
      return {
        path,
        message: [
          privacyFirstMessages.invalid_string,
          formatStringValidation(issue.validation),
        ].join('; '),
      };
    }

    case 'invalid_enum_value': {
      return {
        path,
        message: privacyFirstMessages.invalid_enum_value,
      };
    }

    case 'invalid_literal': {
      return {
        path,
        message: privacyFirstMessages.invalid_literal,
      };
    }

    case 'invalid_union_discriminator': {
      return {
        path,
        message: privacyFirstMessages.invalid_union_discriminator,
      };
    }

    case 'invalid_union': {
      return {
        path,
        message: privacyFirstMessages.invalid_union,
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
        message: privacyFirstMessages.invalid_arguments,
      };
    }

    case 'invalid_return_type': {
      return {
        path,
        message: privacyFirstMessages.invalid_return_type,
      };
    }

    case 'invalid_date': {
      return {
        path,
        message: privacyFirstMessages.invalid_date,
      };
    }

    case 'not_finite': {
      return {
        path,
        message: privacyFirstMessages.not_finite,
      };
    }

    case 'invalid_intersection_types': {
      return {
        path,
        message: privacyFirstMessages.invalid_intersection_types,
      };
    }

    case 'not_multiple_of': {
      return {
        path,
        message: privacyFirstMessages.not_multiple_of,
      };
    }

    case 'unrecognized_keys': {
      return {
        path,
        message: privacyFirstMessages.unrecognized_keys,
      };
    }

    case 'custom': {
      return {
        path,
        message: privacyFirstMessages.custom,
      };
    }

    default: {
      return {
        path,
        message: privacyFirstMessages.default,
      };
    }
  }
};
