import {z} from 'zod';
import {
  type StringEffectFieldValidator,
  type StringFieldValidator,
} from './model.js';
import {isSingleLine} from './field-utils.js';

/** String sizes [ 10, 20, 30, 50, 80, 140, 200, 400, 600, 1000, 1600, 2600, 5000] */
type StringFieldKey =
  | 'string1To10'
  | 'string1To20'
  | 'string1To30'
  | 'string1To50'
  | 'string1To80'
  | 'string1To140'
  | 'string1To200'
  | 'string1To400'
  | 'string1To600'
  | 'string1To1000'
  | 'string1To1600'
  | 'string1To2600'
  | 'string1To5000'
  | 'stringKeyName'
  | 'stringBaseName';

type StringEffectFieldKey =
  | 'string1To10Line'
  | 'string1To20Line'
  | 'string1To30Line'
  | 'string1To50Line'
  | 'string1To80Line'
  | 'string1To140Line';

export const stringFields: StringFieldValidator<StringFieldKey> = {
  string1To10: z.string().min(1).max(10),
  string1To20: z.string().min(1).max(20),
  string1To30: z.string().min(1).max(30),
  string1To50: z.string().min(1).max(50),
  string1To80: z.string().min(1).max(80),
  string1To140: z.string().min(1).max(140),
  string1To200: z.string().min(1).max(200),
  string1To400: z.string().min(1).max(400),
  string1To600: z.string().min(1).max(600),
  string1To1000: z.string().min(1).max(1000),
  string1To1600: z.string().min(1).max(1600),
  string1To2600: z.string().min(1).max(2600),
  string1To5000: z.string().min(1).max(5000),
  stringKeyName: z
    .string()
    .min(1)
    .max(60)
    .regex(/[a-z][\d_a-z]+/),
  stringBaseName: z
    .string()
    .min(1)
    .max(60)
    .regex(/[a-z][\d._a-z-]+/),
};

const singleLineMessage = (max: number) =>
  `The string should be a single line with less than ${max} characters`;

export const stringEffectFields: StringEffectFieldValidator<StringEffectFieldKey> =
  {
    string1To10Line: z
      .string()
      .min(1)
      .max(10)
      .refine(isSingleLine, {message: singleLineMessage(10)}),
    string1To20Line: z
      .string()
      .min(1)
      .max(20)
      .refine(isSingleLine, {message: singleLineMessage(20)}),
    string1To30Line: z
      .string()
      .min(1)
      .max(30)
      .refine(isSingleLine, {message: singleLineMessage(30)}),
    string1To50Line: z
      .string()
      .min(1)
      .max(50)
      .refine(isSingleLine, {message: singleLineMessage(50)}),
    string1To80Line: z
      .string()
      .min(1)
      .max(80)
      .refine(isSingleLine, {message: singleLineMessage(80)}),
    string1To140Line: z
      .string()
      .min(1)
      .max(140)
      .refine(isSingleLine, {message: singleLineMessage(140)}),
  };
