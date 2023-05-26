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

    default: {
      return {
        path,
        message: 'The type for the field is incorrect',
      };
    }
  }
};
